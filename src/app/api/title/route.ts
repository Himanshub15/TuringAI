import { generateText } from "ai";
import { nim } from "@/lib/nim";

export async function POST(req: Request) {
  const { messages } = await req.json();

  if (!messages || messages.length === 0) {
    return new Response(JSON.stringify({ title: "New Chat" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Take first few messages for context
  const context = messages
    .slice(0, 6)
    .map((m: { role: string; content?: string; parts?: { type: string; text: string }[] }) => {
      const text = m.parts
        ? m.parts.filter((p) => p.type === "text").map((p) => p.text).join("")
        : m.content || "";
      return `${m.role}: ${text}`;
    })
    .join("\n");

  try {
    const { text } = await generateText({
      model: nim.chatModel("moonshotai/kimi-k2.5"),
      prompt: `Based on this conversation, generate a short title (3-6 words max). Just return the title, nothing else. No quotes, no punctuation at the end.\n\n${context}`,
      maxOutputTokens: 30,
      temperature: 0.3,
    });

    const title = text.trim().replace(/^["']|["']$/g, "").slice(0, 60);
    return new Response(JSON.stringify({ title }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    // Fallback to first message truncation
    const firstMsg = messages[0];
    const text = firstMsg.parts
      ? firstMsg.parts.filter((p: { type: string }) => p.type === "text").map((p: { text: string }) => p.text).join("")
      : firstMsg.content || "New Chat";
    const title = text.slice(0, 50) + (text.length > 50 ? "..." : "");
    return new Response(JSON.stringify({ title }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}
