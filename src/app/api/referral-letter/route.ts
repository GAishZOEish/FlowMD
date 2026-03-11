import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { fromPractice, toPractice, specialty, referralReason, relevantHistory, urgency } = await req.json();

    if (!specialty || !referralReason) {
      return new Response(JSON.stringify({ error: "Specialty and referral reason are required." }), { status: 400 });
    }

    const prompt = `You are a medical administrative assistant helping a physician's front office draft a professional referral letter.

Referral Details:
${fromPractice ? `- Referring Practice: ${fromPractice}` : ""}
${toPractice ? `- Referring To: ${toPractice}` : ""}
- Specialty: ${specialty}
- Reason for Referral: ${referralReason}
${relevantHistory ? `- Relevant History: ${relevantHistory}` : ""}
${urgency ? `- Urgency: ${urgency}` : ""}

Write a professional referral letter that includes:
1. A formal salutation
2. The reason for referral
3. Relevant clinical context provided
4. Any urgency indicators
5. A professional closing

Guidelines:
- Professional but warm tone
- Do not invent clinical details not provided
- Do not use a patient name (none provided)
- Keep it concise — under 250 words
- Use standard referral letter format`;

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
    console.error("Referral letter API error:", error);
    return new Response(JSON.stringify({ error: "Something went wrong." }), { status: 500 });
  }
}
