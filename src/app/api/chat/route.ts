import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { openrouter, MODELS } from "@/lib/openrouter";
import { nim } from "@/lib/nim";
import { checkRateLimit, getClientIP, isAdmin } from "@/lib/rate-limit";

export const maxDuration = 60;

// 20 messages per day per IP
const RATE_LIMIT = { maxRequests: 20, windowMs: 24 * 60 * 60 * 1000 };

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
    ? `You are a helpful AI assistant. The user has enabled web search. Here are relevant search results to help answer their question:\n\n${searchResults}\n\nUse these search results to provide an informed, up-to-date answer. Cite sources when relevant.`
    : "You are a helpful AI assistant. Be concise, clear, and helpful.";

  const convertedMessages = await convertToModelMessages(messages);

  // Try OpenRouter first, fall back to NVIDIA NIM
  try {
    const result = streamText({
      model: openrouter.chatModel(MODELS.chat),
      system: systemPrompt,
      messages: convertedMessages,
      maxOutputTokens: 4096,
      temperature: 0.7,
    });
    return result.toTextStreamResponse();
  } catch {
    // Fallback to NVIDIA NIM
    const result = streamText({
      model: nim.chatModel("moonshotai/kimi-k2.5"),
      system: systemPrompt,
      messages: convertedMessages,
      maxOutputTokens: 4096,
      temperature: 0.7,
    });
    return result.toTextStreamResponse();
  }
}
