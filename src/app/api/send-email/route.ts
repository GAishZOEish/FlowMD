import { NextRequest } from "next/server";

const EMAIL_ENABLED = false; // flip to true once domain is verified in Resend

export async function POST(req: NextRequest) {
  if (!EMAIL_ENABLED) {
    return new Response(
      JSON.stringify({ comingSoon: true, message: "Email delivery coming soon. Domain verification required." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  const { to, subject, html, practiceName } = await req.json();
  if (!to || !subject || !html) {
    return new Response(JSON.stringify({ error: "to, subject, and html are required" }), { status: 400 });
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const from = process.env.RESEND_FROM_EMAIL ?? "noreply@flowmd.com";
    const fromName = practiceName ? `${practiceName} via FlowMD` : "FlowMD";

    const { data, error } = await resend.emails.send({
      from: `${fromName} <${from}>`,
      to,
      subject,
      html,
    });

    if (error) throw new Error(error.message);

    return new Response(JSON.stringify({ success: true, id: data?.id }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send email";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
