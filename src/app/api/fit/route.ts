import { streamCompletion } from "@/lib/openrouter";
import { buildFitSystemPrompt } from "@/lib/twin";

const MAX_JD_CHARS = 12000;

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const jd =
    body && typeof body === "object" && "jd" in body && typeof body.jd === "string"
      ? body.jd.trim()
      : "";

  if (jd.length < 80 || jd.length > MAX_JD_CHARS) {
    return Response.json(
      { error: `Paste a job description between 80 and ${MAX_JD_CHARS} characters.` },
      { status: 400 },
    );
  }

  return streamCompletion(
    [
      { role: "system", content: buildFitSystemPrompt() },
      { role: "user", content: `Job description:\n\n${jd}` },
    ],
    4096,
  );
}
