import { TWIN_MODELS } from "@/lib/twin";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

/** Stream an OpenRouter chat completion back to the client as SSE. */
export async function streamCompletion(messages: ChatMessage[], maxTokens: number) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "The Digital Twin is not configured." },
      { status: 500 },
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
      models: TWIN_MODELS,
      temperature: 0.4,
      max_tokens: maxTokens,
      stream: true,
      reasoning: { effort: "low", exclude: true },
      messages,
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
