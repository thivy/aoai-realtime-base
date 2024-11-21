import { streamText } from "ai";
// import { azure } from '@ai-sdk/azure';
import { AzureProvider } from "@/features/chat-page/azure";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const azure = AzureProvider();

  const result = streamText({
    model: azure,
    messages,
  });

  return result.toDataStreamResponse();
}
