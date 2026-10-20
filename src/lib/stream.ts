function extractDelta(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const choices = "choices" in payload ? payload.choices : null;
  if (!Array.isArray(choices) || !choices[0] || typeof choices[0] !== "object") {
    return "";
  }
  const delta = "delta" in choices[0] ? choices[0].delta : null;
  if (!delta || typeof delta !== "object") return "";
  if ("content" in delta && typeof delta.content === "string") {
    return delta.content;
  }
  return "";
}

/** POST JSON to a Twin endpoint and call onText with the growing reply. Returns the full text. */
export async function streamTwin(
  url: string,
  body: unknown,
  onText: (text: string) => void,
): Promise<string> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (response.status === 429) {
    throw new Error("You're sending messages too quickly. Wait a minute and try again.");
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(payload?.error ?? "The Twin could not reply.");
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response stream.");

  const decoder = new TextDecoder();
  let buffer = "";
  let assembled = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split("\n");
    buffer = chunks.pop() ?? "";

    for (const line of chunks) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        assembled += extractDelta(JSON.parse(data));
        onText(assembled);
      } catch {
        // Ignore malformed SSE leftovers.
      }
    }
  }

  if (!assembled.trim()) {
    throw new Error("The Twin returned an empty reply.");
  }
  return assembled;
}
