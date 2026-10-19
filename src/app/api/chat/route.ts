import { streamCompletion } from "@/lib/openrouter";
import { buildTwinSystemPrompt } from "@/lib/twin";

type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

function sanitizeMessages(input: unknown): ChatTurn[] {
  if (!Array.isArray(input)) {
    throw new Error("messages must be an array");
  }

  const cleaned: ChatTurn[] = [];
  for (const item of input.slice(-20)) {
    if (!item || typeof item !== "object") continue;
    const role = "role" in item ? item.role : null;
    const content = "content" in item ? item.content : null;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") {
      continue;
    }
    const text = content.trim();
    if (!text || text.length > 4000) continue;
    cleaned.push({ role, content: text });
  }

  if (cleaned.length === 0) {
    throw new Error("No valid messages");
  }

  return cleaned;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  let messages: ChatTurn[];
  try {
    messages = sanitizeMessages(
      body && typeof body === "object" && "messages" in body
        ? body.messages
        : null,
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Invalid messages" },
      { status: 400 },
    );
  }

  return streamCompletion(
    [{ role: "system", content: buildTwinSystemPrompt() }, ...messages],
    1024,
  );
}
