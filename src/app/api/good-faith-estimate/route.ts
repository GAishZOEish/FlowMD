import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { practiceName, providerName, scheduledDate, serviceLines, additionalNotes } =
      await req.json();

    if (!practiceName || !serviceLines?.length || !serviceLines[0].code || !serviceLines[0].rate) {
      return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
    }

    const servicesSummary = serviceLines
      .filter((l: { code: string; rate: string }) => l.code && l.rate)
      .map(
        (l: { code: string; description: string; quantity: string; rate: string }) =>
          `- CPT ${l.code}${l.description ? ` (${l.description})` : ""}: Qty ${l.quantity || 1} × ${l.rate}`
      )
      .join("\n");

    const totalEstimate = serviceLines
      .filter((l: { code: string; rate: string }) => l.code && l.rate)
      .reduce((sum: number, l: { quantity: string; rate: string }) => {
        const qty = parseFloat(l.quantity) || 1;
        const rate = parseFloat(l.rate.replace(/[^0-9.]/g, "")) || 0;
        return sum + qty * rate;
      }, 0);

    const prompt = `You are a medical billing expert helping a physician's practice generate a Good Faith Estimate (GFE) document for an uninsured or self-pay patient.

This document is required under the No Surprises Act (effective January 2022). It must be provided to the patient at least 3 business days before a scheduled service.

Practice Information:
- Practice Name: ${practiceName}
${providerName ? `- Provider: ${providerName}` : ""}
${scheduledDate ? `- Scheduled Service Date: ${scheduledDate}` : ""}

Services and Rates:
${servicesSummary}

Estimated Total: $${totalEstimate.toFixed(2)}
${additionalNotes ? `\nAdditional Notes: ${additionalNotes}` : ""}

Generate a complete Good Faith Estimate document that includes:

1. A header section with practice name, document title ("Good Faith Estimate"), and date placeholder
2. A clear statement that this is a Good Faith Estimate for a self-pay or uninsured patient
3. An itemized list of services with plain-English descriptions of each CPT code, quantity, and self-pay rate
4. The total estimated cost
5. A plain-language explanation of what a Good Faith Estimate is and what rights the patient has under the No Surprises Act
6. Information about the patient's right to dispute a bill that exceeds this estimate by more than $400
7. Contact information placeholder [PRACTICE PHONE] and [PRACTICE ADDRESS]
8. A signature/acknowledgment section for the patient
9. A brief disclaimer that this is an estimate and actual charges may vary if the scope of services changes

Keep the language warm, clear, and professional. The patient may be anxious about costs — the tone should be reassuring and transparent. Use plain English throughout, not billing jargon.

Format it as a complete, print-ready document.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const output = message.content
      .filter(block => block.type === "text")
      .map(block => (block as { type: "text"; text: string }).text)
      .join("\n");

    return new Response(JSON.stringify({ output }), { headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Good faith estimate API error:", error);
    return new Response(JSON.stringify({ error: "Invalid request" }), { status: 500 });
  }
}
