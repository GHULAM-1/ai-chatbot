import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "edge";
export async function POST(req: Request) {
  const { messages, sessionId } = await req.json();
  console.log(sessionId);
  const openai = new OpenAI({
    apiKey: sessionId,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages,
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
