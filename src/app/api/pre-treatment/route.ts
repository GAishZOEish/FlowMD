import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { planType, payer, cptCodes, deductible, deductibleMet, coinsurance, copay, oopMax, oopMet } = await req.json();

    if (!planType || !cptCodes) {
      return new Response(JSON.stringify({ error: "Plan type and CPT codes are required." }), { status: 400 });
    }

    const prompt = `You are a medical billing expert helping a physician's front office staff prepare patients for their upcoming visit.

Given the following insurance and billing information, generate a plain-language pre-treatment coverage summary that a front office staff member can share with the patient BEFORE their appointment.

Insurance Details:
- Plan Type: ${planType}
${payer ? `- Payer: ${payer}` : ""}
- CPT Codes: ${cptCodes}
${deductible ? `- Annual Deductible: $${deductible}` : ""}
${deductibleMet ? `- Deductible Met: $${deductibleMet}` : ""}
${coinsurance ? `- Coinsurance: ${coinsurance}%` : ""}
${copay ? `- Copay: $${copay}` : ""}
${oopMax ? `- Out-of-Pocket Max: $${oopMax}` : ""}
${oopMet ? `- OOP Max Met: $${oopMet}` : ""}

Write a clear, friendly plain-language summary that covers:
1. Whether these services are typically covered under this type of plan
2. Likely patient out-of-pocket costs based on the plan details provided
3. Whether prior authorization is commonly required for any of these codes
4. Any important caveats or things the patient should know before their visit
5. A suggested script for front desk staff to explain this to the patient verbally (2-3 sentences)

Important guidelines:
- Use plain English, not billing jargon
- Be honest about uncertainty — use phrases like "typically," "generally," or "in most cases" where coverage varies
- Do NOT use the patient's name (none was provided)
- Keep the tone warm and helpful, not bureaucratic
- End with a clear disclaimer that this is an estimate only and the patient should verify with their insurer

Format the output with clear sections. Keep it concise — under 400 words.`;

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
    console.error("Pre-treatment API error:", error);
    return new Response(JSON.stringify({ error: "Something went wrong." }), { status: 500 });
  }
}
