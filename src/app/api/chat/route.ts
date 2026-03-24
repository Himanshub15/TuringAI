import { streamText, type UIMessage } from "ai";
import { openrouter, MODELS } from "@/lib/openrouter";
import { nim } from "@/lib/nim";
import { checkRateLimit, getClientIP, isAdmin } from "@/lib/rate-limit";

export const maxDuration = 60;

// 20 messages per day per IP
const RATE_LIMIT = { maxRequests: 20, windowMs: 24 * 60 * 60 * 1000 };

// Pick the model provider — OpenRouter if key exists, else NVIDIA NIM
function getModel() {
  if (process.env.OPENROUTER_API_KEY) {
    return openrouter.chatModel(MODELS.chat);
  }
  return nim.chatModel("moonshotai/kimi-k2.5");
}

function extractText(msg: UIMessage): string {
  return (
    msg.parts
      ?.filter((p) => p.type === "text")
      .map((p) => (p as { type: "text"; text: string }).text)
      .join("") || ""
  );
}

export async function POST(req: Request) {
  // Admin bypass
  if (!isAdmin(req)) {
    const ip = getClientIP(req);
    const result = checkRateLimit(`chat:${ip}`, RATE_LIMIT);

    if (!result.allowed) {
      const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded. Please try again later.",
          retryAfter,
          remaining: 0,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfter),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(result.resetAt),
          },
        }
      );
    }
  }

  const {
    messages,
    searchResults,
  }: {
    messages: UIMessage[];
    searchResults?: string;
  } = await req.json();

  const systemPrompt = searchResults
    ? `You are TuringAI, a helpful AI assistant. The user has enabled web search. Here are relevant search results to help answer their question:\n\n${searchResults}\n\nUse these search results to provide an informed, up-to-date answer. Cite sources when relevant.`
    : "You are TuringAI, a helpful AI assistant. Be concise, clear, and helpful.";

  // Convert UIMessages to simple role/content and add system as first "user" turn
  const simpleMessages: { role: "user" | "assistant"; content: string }[] = [];

  // Gemma doesn't support system messages — inject as user/assistant pair
  simpleMessages.push({ role: "user", content: systemPrompt });
  simpleMessages.push({ role: "assistant", content: "Understood. I'll follow these instructions." });

  for (const m of messages) {
    const text = extractText(m);
    if (text) {
      simpleMessages.push({ role: m.role as "user" | "assistant", content: text });
    }
  }

  const result = streamText({
    model: getModel(),
    messages: simpleMessages,
    maxOutputTokens: 4096,
    temperature: 0.7,
  });

  return result.toTextStreamResponse();
}
