import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const {
      conditionToUse,
      readingLevel,
      format,
      practiceName,
      includeWhenToSeekCare,
      includeDietLifestyle,
      includeHowDiagnosed,
      includeTreatmentOverview,
    } = await req.json();

    if (!conditionToUse) {
      return new Response(JSON.stringify({ error: "Missing required field: condition" }), { status: 400 });
    }

    const sections = [
      "What it is and what causes it",
      includeHowDiagnosed && "How it is diagnosed",
      includeTreatmentOverview && "Treatment overview (general — not specific medical advice)",
      includeDietLifestyle && "Diet and lifestyle tips",
      includeWhenToSeekCare && "When to seek care and warning signs to watch for",
    ].filter(Boolean).join(", ");

    const formatMap: Record<string, string> = {
      "Patient handout (print-ready)": "Format this as a clean, print-ready patient handout with clear section headers. End with a footer containing the practice name and a disclaimer that this is general health education only.",
      "Website page content": "Format this as website page content with an engaging opening paragraph, clear headers, and short paragraphs suitable for online reading.",
      "FAQ style (questions and answers)": "Format this as a series of frequently asked questions with clear answers. Use natural questions a patient would actually ask.",
      "Brief summary (one paragraph)": "Write this as a single clear, informative paragraph. No headers. Concise but complete.",
    };
    const formatInstructions = formatMap[format] || "Format this as a patient handout with clear section headers.";

    const readingMap: Record<string, string> = {
      "Plain English (6th grade)": "Use very simple language a 6th grader could understand. Short sentences. Common words. No medical jargon — if you must use a medical term, immediately explain it in parentheses.",
      "General adult (8th–10th grade)": "Use clear, accessible language for a general adult audience. Some medical terms are fine if explained briefly.",
      "Detailed / health-literate adult": "You can use standard medical terminology and assume the reader has a basic health literacy. Still keep it clear and organized.",
    };
    const readingInstructions = readingMap[readingLevel] || "Use plain, simple language.";

    const prompt = `You are a medical writer creating patient education content for a physician's practice.

Generate patient education content about: ${conditionToUse}

Sections to include: ${sections}

Reading level instructions: ${readingInstructions}

Format instructions: ${formatInstructions}

${practiceName ? `Practice name for footer/attribution: ${practiceName}` : ""}

Important guidelines:
- This is GENERAL health education content — not advice for any specific individual patient
- Do NOT include anything that could be interpreted as diagnosing or treating a specific person
- Do NOT use second person ("you should take this medication") for treatment specifics — use third person ("patients may be prescribed...")
- For "when to seek care" sections, err on the side of encouraging patients to consult their doctor
- Keep the tone warm, reassuring, and empowering — patients should feel informed, not alarmed
- All content must be medically accurate and based on established clinical guidelines
- End every piece with a clear disclaimer: "This information is for general educational purposes only and is not a substitute for professional medical advice. Always consult your doctor or healthcare provider with questions about your health."`;

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
    console.error("Condition explainer API error:", error);
    return new Response(JSON.stringify({ error: "Invalid request" }), { status: 500 });
  }
}
