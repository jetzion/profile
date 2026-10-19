"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Role = "user" | "assistant";

type ChatTurn = {
  role: Role;
  content: string;
};

const starters = [
  "What are you working on now?",
  "Walk me through your career arc.",
  "What results did you drive at Forta?",
  "How do you approach product discovery?",
];

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

export function TwinChat() {
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;

    const nextMessages: ChatTurn[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setBusy(true);
    setError(null);
    setMessages([...nextMessages, { role: "assistant", content: "" }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

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
            const snapshot = assembled;
            setMessages((current) => {
              const copy = [...current];
              copy[copy.length - 1] = { role: "assistant", content: snapshot };
              return copy;
            });
          } catch {
            // Ignore malformed SSE leftovers.
          }
        }
      }

      if (!assembled.trim()) {
        throw new Error("The Twin returned an empty reply.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setMessages((current) => {
        if (current.length && current[current.length - 1].role === "assistant") {
          return current.slice(0, -1);
        }
        return current;
      });
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void send(input);
  }

  return (
    <div className="flex min-h-[70vh] flex-col border border-line bg-bg-2">
      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6 md:px-8">
        {messages.length === 0 ? (
          <div className="max-w-xl">
            <p className="font-display text-2xl">Ask the Twin anything about Jack’s career.</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              It is grounded in the same résumé and LinkedIn record as this site —
              roles, results, and how the work actually got done.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {starters.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void send(prompt)}
                  className="border border-line px-3 py-2 text-left text-sm text-muted transition-colors hover:border-accent hover:text-ink"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message, i) => (
            <div
              key={`${message.role}-${i}`}
              className={message.role === "user" ? "ml-auto max-w-xl" : "max-w-2xl"}
            >
              <p className="eyebrow mb-2">
                {message.role === "user" ? "You" : "Digital Twin"}
              </p>
              <p
                className={`whitespace-pre-wrap text-sm leading-relaxed md:text-base ${
                  message.role === "user"
                    ? "border border-line bg-bg px-4 py-3"
                    : "text-ink"
                }`}
              >
                {message.content || (busy && i === messages.length - 1 ? "Thinking…" : "")}
              </p>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={onSubmit}
        className="border-t border-line bg-bg p-4 md:p-5"
      >
        <label htmlFor="twin-input" className="eyebrow mb-3 block">
          Type your question
        </label>
        <div className="flex flex-col gap-3 border border-brass/50 bg-(--input-bg) px-3 py-3 shadow-[inset_3px_0_0_0_var(--brass)] transition-colors focus-within:border-accent focus-within:shadow-[inset_3px_0_0_0_var(--accent)] md:flex-row md:items-end">
          <textarea
            id="twin-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void send(input);
              }
            }}
            rows={3}
            placeholder="Ask the Twin about Jack’s career…"
            className="min-h-[4.5rem] flex-1 resize-none bg-transparent px-2 py-2 text-base leading-relaxed text-ink caret-accent outline-none placeholder:text-muted"
            disabled={busy}
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="bg-accent px-5 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-30"
          >
            {busy ? "Sending" : "Send"}
          </button>
        </div>
        <p className="mt-2 text-xs text-faint">Enter to send · Shift+Enter for a new line</p>
      </form>
      {error ? <p className="border-t border-line px-4 py-3 text-sm text-brass">{error}</p> : null}
    </div>
  );
}
