import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { nim } from "@/lib/nim";

export const maxDuration = 60;

export async function POST(req: Request) {
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

  const result = streamText({
    model: nim.chatModel("moonshotai/kimi-k2.5"),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 4096,
    temperature: 0.7,
  });

  return result.toTextStreamResponse();
}
