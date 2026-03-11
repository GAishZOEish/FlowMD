import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { cptCode, payer, denialType, denialText } = await req.json();
    if (!cptCode || !payer || !denialType) {
      return new Response(JSON.stringify({ error: "CPT code, payer, and denial reason are required" }), { status: 400 });
    }

    const prompt = `You are a medical billing expert helping a front office team navigate a prior authorization denial.

CPT Code: ${cptCode} | Payer: ${payer} | Denial: ${denialType}${denialText ? `\nDenial text: ${denialText}` : ""}

Use these exact section headers (all caps):

WHY PRIOR AUTH WAS REQUIRED
Plain English — why ${payer} requires auth for this procedure or situation.

WHAT THIS DENIAL MEANS
What happened and what the practice's current position is.

APPEAL OPTIONS
1. First-level internal appeal — what to submit
2. Peer-to-peer review — when available and how to request
3. External review — when this becomes available

APPEAL TIMELINE
Typical timeframes. Note that ${payer} deadlines should be verified on the denial letter.

DOCUMENTATION TO GATHER
Specific checklist the front office can act on immediately.

Be direct. Write for a billing coordinator who needs to act today.`;

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
