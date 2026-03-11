import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: Request) {
  const { cptCode, icdCode, payer, planType } = await req.json();

  const prompt = `You are a medical billing expert. A clinician wants to know if a CPT/ICD-10 code combination is typically covered by a payer.

CPT Code: ${cptCode}
ICD-10 Code: ${icdCode}
Payer: ${payer}${planType ? `\nPlan Type: ${planType}` : ""}

Provide a clear, structured analysis with these sections:

COVERAGE ASSESSMENT
Is this CPT/ICD-10 combination typically covered by ${payer}? Give a clear likely covered / likely denied / conditional assessment with a brief reason.

ICD-10 SPECIFICITY CHECK
Is the ICD-10 code specific enough to support this procedure? Note if a more specific code would improve coverage odds.

COMMON DENIAL REASONS
List the most common reasons this combination gets denied by ${payer} or similar payers.

ALTERNATIVE CPT CODES
If coverage is unlikely, list 2-3 alternative CPT codes that may be better supported by this diagnosis, with a brief note on each.

DOCUMENTATION TIPS
Key documentation elements that support medical necessity for this combination.

Be direct and specific. Use plain language a front office coordinator can act on.`;

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
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
}
