import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { payer, planType, serviceDate, cptCodes, totalBilled } = await req.json();

    if (!cptCodes || !totalBilled) {
      return new Response(JSON.stringify({ error: "CPT codes and total amount are required." }), { status: 400 });
    }

    const prompt = `You are a medical billing expert helping a physician's front office explain how to submit a superbill to insurance.

Superbill Details:
${payer ? `- Payer: ${payer}` : ""}
${planType ? `- Plan Type: ${planType}` : ""}
${serviceDate ? `- Date of Service: ${serviceDate}` : ""}
- CPT Codes: ${cptCodes}
- Total Billed: $${totalBilled}

Generate a plain-language step-by-step guide for the patient explaining:
1. What a superbill is and why they have one
2. Exactly how to submit it to their insurance for reimbursement
3. What to expect after submission (timeline, partial reimbursement, etc.)
4. Common reasons claims get rejected and how to avoid them
5. Who to contact if they have questions

Guidelines:
- Use plain English, no billing jargon
- Numbered steps where appropriate
- Warm, helpful tone
- End with a disclaimer that reimbursement amounts vary by plan

Keep it under 400 words.`;

    const stream = client.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
            controller.enqueue(new TextEncoder().encode(chunk.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  } catch (error) {
    console.error("Superbill API error:", error);
    return new Response(JSON.stringify({ error: "Something went wrong." }), { status: 500 });
  }
}
