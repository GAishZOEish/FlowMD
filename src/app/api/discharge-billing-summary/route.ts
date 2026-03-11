import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { providerName, payer, procedureType, cptCodes, totalBilled, insurerPaid, patientOwes, followUpCharges } = await req.json();

    if (!cptCodes || !totalBilled) {
      return new Response(JSON.stringify({ error: "CPT codes and total billed are required." }), { status: 400 });
    }

    const prompt = `You are a medical billing expert helping a physician's front office generate a plain-language discharge billing summary for a patient.

Discharge Details:
${providerName ? `- Facility: ${providerName}` : ""}
${procedureType ? `- Procedure: ${procedureType}` : ""}
- CPT Codes: ${cptCodes}
- Total Billed: $${totalBilled}
${insurerPaid ? `- Insurance Paid: $${insurerPaid}` : ""}
${patientOwes ? `- Patient Responsibility: $${patientOwes}` : ""}
${followUpCharges ? `- Expected Follow-up Charges: ${followUpCharges}` : ""}

Write a plain-language billing summary that explains:
1. What procedure was performed
2. What was billed and what insurance covered
3. What the patient owes and why
4. Any follow-up charges to expect (e.g. separate pathology or anesthesia bills)
5. How and when to pay

Guidelines:
- Plain English, no billing jargon
- Warm, reassuring tone
- Do not use the patient's name
- End with a disclaimer that this is a summary only
- Under 350 words`;

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
    console.error("Discharge billing API error:", error);
    return new Response(JSON.stringify({ error: "Something went wrong." }), { status: 500 });
  }
}
