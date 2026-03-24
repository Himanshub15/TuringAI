import { generateText } from "ai";
import { openrouter, MODELS } from "@/lib/openrouter";
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

  const titlePrompt = `You are a title generator. Read this conversation and create a SHORT descriptive topic title (2-5 words). The title should summarize what the conversation is ABOUT, not repeat the question. Examples: "Python List Sorting", "Indian Time Zone", "React State Management", "Pi Mathematical Constant".\n\nConversation:\n${context}\n\nTitle:`;

  // Try OpenRouter first, fall back to NVIDIA NIM, then truncation
  try {
    const { text } = await generateText({
      model: openrouter.chatModel(MODELS.title),
      prompt: titlePrompt,
      maxOutputTokens: 30,
      temperature: 0.3,
    });
    const title = text.trim().replace(/^["']|["']$/g, "").slice(0, 60);
    return new Response(JSON.stringify({ title }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    try {
      // Fallback to NVIDIA NIM
      const { text } = await generateText({
        model: nim.chatModel("moonshotai/kimi-k2.5"),
        prompt: titlePrompt,
        maxOutputTokens: 30,
        temperature: 0.3,
      });
      const title = text.trim().replace(/^["']|["']$/g, "").slice(0, 60);
      return new Response(JSON.stringify({ title }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      // Final fallback: truncate first message
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
}
