import { buildTwinSystemPrompt, TWIN_MODEL } from "@/lib/twin";

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
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "The Digital Twin is not configured." },
      { status: 500 },
    );
  }

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

  const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "Jack Etzion Digital Twin",
    },
    body: JSON.stringify({
      model: TWIN_MODEL,
      temperature: 0.4,
      stream: true,
      reasoning: { effort: "low", exclude: true },
      messages: [
        { role: "system", content: buildTwinSystemPrompt() },
        ...messages,
      ],
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    console.error("OpenRouter error", upstream.status, detail.slice(0, 500));
    return Response.json(
      { error: "The Digital Twin could not be reached. Try again in a moment." },
      { status: 502 },
    );
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
