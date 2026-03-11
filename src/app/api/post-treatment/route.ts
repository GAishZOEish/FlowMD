import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { serviceDate, providerName, payer, cptCodes, totalBilled, insurerPaid, adjustments, patientOwes, adjustmentReason } = await req.json();

    if (!cptCodes || !totalBilled) {
      return new Response(JSON.stringify({ error: "CPT codes, amount billed, and patient responsibility are required." }), { status: 400 });
    }

    const prompt = `You are a medical billing expert helping a physician's front office generate a plain-language post-adjudication letter for a patient.

Claim Details:
${serviceDate ? `- Date of Service: ${serviceDate}` : ""}
${providerName ? `- Provider: ${providerName}` : ""}
- CPT Codes: ${cptCodes}
- Total Billed: $${totalBilled}
${insurerPaid ? `- Insurance Paid: $${insurerPaid}` : ""}
${adjustments ? `- Adjustments: $${adjustments}` : ""}
- Patient Responsibility: $${patientOwes}
${adjustmentReason ? `- Adjustment Reason: ${adjustmentReason}` : ""}

Write a clear, friendly plain-language letter that explains:
1. What service was provided and when
2. What was billed and what the insurance paid
3. Why the patient owes their portion (deductible, coinsurance, copay, or denial)
4. What the patient needs to do next
5. Who to contact with questions

Guidelines:
- Use plain English, no billing jargon
- Warm, non-threatening tone
- Do not use the patient's name
- End with a disclaimer that this is a summary and they should contact the office with questions

Keep it under 350 words. Format with clear sections.`;

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
    console.error("Post-treatment API error:", error);
    return new Response(JSON.stringify({ error: "Something went wrong." }), { status: 500 });
  }
}
