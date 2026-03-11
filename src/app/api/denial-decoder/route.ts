import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { carc, rarc, payer, cptCode } = await req.json();
    if (!carc) return new Response(JSON.stringify({ error: "CARC code is required" }), { status: 400 });

    const prompt = `You are a medical billing expert helping a front office team understand a claim denial.

Denial codes: CARC ${carc}${rarc ? `, RARC ${rarc}` : ""}${payer ? `, Payer: ${payer}` : ""}${cptCode ? `, CPT: ${cptCode}` : ""}

Use these exact section headers (all caps):

WHAT THIS MEANS
Plain-English explanation. No jargon.

WHY IT WAS TRIGGERED
2-4 concrete scenarios that cause this denial.

WHAT TO DO NEXT
Step-by-step resolution. Include timely filing window if relevant.

PREVENTION
1-2 things to prevent this denial on future claims.

Be direct. No filler.`;

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed. Please try again." }), { status: 500 });
  }
}
