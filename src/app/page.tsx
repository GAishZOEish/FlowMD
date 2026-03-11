"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [practiceName, setPracticeName] = useState("");
  const [copied, setCopied] = useState(false);

  const slug = practiceName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const scriptTag = `<script src="https://flowmd.vercel.app/embed.js" data-practice="${slug || "your-practice"}"></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptTag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f8f8f8; }
        .tool-card { transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease; }
        .tool-card:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(10,22,40,0.08); border-color: #c41230 !important; }
        .btn-primary { transition: background 0.15s ease; }
        .btn-primary:hover { background: #a00f28 !important; }
        .btn-outline:hover { background: rgba(255,255,255,0.08) !important; }
        a { text-decoration: none; }
      `}</style>

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "#0a1628",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "0 48px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 600, color: "#fff", letterSpacing: "0.02em" }}>FlowMD</span>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <a href="#tools" style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, letterSpacing: "0.05em", fontFamily: "var(--font-sans)" }}>Tools</a>
            <a href="#compliance" style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, letterSpacing: "0.05em", fontFamily: "var(--font-sans)" }}>Compliance</a>
            <a href="#embed" style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, letterSpacing: "0.05em", fontFamily: "var(--font-sans)" }}>Embed</a>
            <a href="#tools" className="btn-primary" style={{ background: "#c41230", color: "#fff", padding: "8px 20px", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500, fontFamily: "var(--font-sans)" }}>Get Access</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #0a1628 0%, #1a3a6b 100%)", padding: "120px 48px 100px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(196,18,48,0.15)", border: "1px solid rgba(196,18,48,0.3)", padding: "5px 14px", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#e8a0b0", marginBottom: 32, fontFamily: "var(--font-sans)" }}>
            Built for independent practices
          </div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(48px, 6vw, 76px)", fontWeight: 400, lineHeight: 1.1, color: "#fff", marginBottom: 32 }}>
            Billing <em style={{ color: "#c41230" }}>clarity.</em> Finally.
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.75, color: "rgba(255,255,255,0.65)", maxWidth: 520, marginBottom: 44, fontFamily: "var(--font-sans)", fontWeight: 300 }}>
            Nine AI tools that eliminate front office billing confusion — coverage estimates, patient letters, denial decoders, and more. No patient records required.
          </p>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", marginBottom: 56 }}>
            <a href="#tools" className="btn-primary" style={{ background: "#c41230", color: "#fff", padding: "14px 32px", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500, fontFamily: "var(--font-sans)" }}>
              See All Tools
            </a>
            <a href="#" className="btn-outline" style={{ background: "transparent", color: "rgba(255,255,255,0.7)", padding: "14px 32px", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.2)", fontFamily: "var(--font-sans)" }}>
              Book a Demo
            </a>
          </div>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {["No PHI required", "No setup or training", "Works on day one", "Free during beta"].map((b) => (
              <div key={b} style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.5)", fontSize: 13, fontFamily: "var(--font-sans)" }}>
                <span style={{ color: "#4caf82" }}>✓</span> {b}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8d0d4", padding: "48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 48 }}>
          {[
            { stat: "30%", label: "of medical claims are denied on first submission" },
            { stat: "11hrs", label: "per week lost to billing admin in a 3-physician practice" },
            { stat: "68%", label: "of patients say confusing bills damage trust in their provider" },
          ].map(({ stat, label }) => (
            <div key={stat}>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 52, fontWeight: 400, color: "#c41230", lineHeight: 1, marginBottom: 12 }}>{stat}</div>
              <div style={{ fontSize: 14, lineHeight: 1.7, color: "#6b7d99", fontFamily: "var(--font-sans)" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tools */}
      <div id="tools" style={{ padding: "96px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c41230", marginBottom: 16, fontFamily: "var(--font-sans)" }}>Nine workflows</div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 40, fontWeight: 400, marginBottom: 16, lineHeight: 1.2 }}>Everything your front office needs</h2>
            <p style={{ fontSize: 16, color: "#6b7d99", maxWidth: 480, lineHeight: 1.75, fontFamily: "var(--font-sans)" }}>Each tool is designed around a specific daily workflow. Enter billing codes, not patient data.</p>
          </div>

          <div style={{ marginBottom: 40, borderBottom: "1px solid #e8d0d4", paddingBottom: 0 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b7d99", marginBottom: 20, fontFamily: "var(--font-sans)" }}>Patient-Facing</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 48 }}>
                <Link href="/pre-treatment" className="tool-card" style={{ background: "#fff", border: "1px solid #e8d0d4", padding: "28px", display: "flex", flexDirection: "column", gap: 12 }}>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 400, color: "#0a1628", lineHeight: 1.3 }}>Pre-Treatment Estimator</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.75, color: "#6b7d99", fontFamily: "var(--font-sans)", flexGrow: 1 }}>Plain-language coverage summary before the visit. No surprises at checkout.</p>
                  <div style={{ paddingTop: 12, borderTop: "1px solid #f0f0f0" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#4caf82", fontFamily: "var(--font-sans)", border: "1px solid #4caf82", padding: "2px 8px" }}>No PHI required</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Insured patients</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Share before visit</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Uses CPT codes</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Uses plan data</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Front desk</span>
                    </div>
                    <div style={{ textAlign: "right" }}><span style={{ color: "#c41230", fontSize: 16 }}>→</span></div>
                  </div>
                </Link>
                <Link href="/post-treatment" className="tool-card" style={{ background: "#fff", border: "1px solid #e8d0d4", padding: "28px", display: "flex", flexDirection: "column", gap: 12 }}>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 400, color: "#0a1628", lineHeight: 1.3 }}>Post-Adjudication Letter</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.75, color: "#6b7d99", fontFamily: "var(--font-sans)", flexGrow: 1 }}>Explain the EOB in plain English. What happened, what they owe, and why.</p>
                  <div style={{ paddingTop: 12, borderTop: "1px solid #f0f0f0" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#4caf82", fontFamily: "var(--font-sans)", border: "1px solid #4caf82", padding: "2px 8px" }}>No PHI required</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Insured patients</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Uses EOB data</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Print or email ready</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Post-adjudication</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Front desk</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Billing staff</span>
                    </div>
                    <div style={{ textAlign: "right" }}><span style={{ color: "#c41230", fontSize: 16 }}>→</span></div>
                  </div>
                </Link>
                <Link href="/good-faith-estimate" className="tool-card" style={{ background: "#fff", border: "1px solid #e8d0d4", padding: "28px", display: "flex", flexDirection: "column", gap: 12 }}>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 400, color: "#0a1628", lineHeight: 1.3 }}>Good Faith Estimate</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.75, color: "#6b7d99", fontFamily: "var(--font-sans)", flexGrow: 1 }}>No Surprises Act compliant cost estimate for self-pay patients in minutes.</p>
                  <div style={{ paddingTop: 12, borderTop: "1px solid #f0f0f0" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#4caf82", fontFamily: "var(--font-sans)", border: "1px solid #4caf82", padding: "2px 8px" }}>No PHI required</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Self-pay & uninsured</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>No Surprises Act compliant</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Required by law</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Pre-service</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Uses CPT codes</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Print or email ready</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Front desk</span>
                    </div>
                    <div style={{ textAlign: "right" }}><span style={{ color: "#c41230", fontSize: 16 }}>→</span></div>
                  </div>
                </Link>
                <Link href="/superbill-explainer" className="tool-card" style={{ background: "#fff", border: "1px solid #e8d0d4", padding: "28px", display: "flex", flexDirection: "column", gap: 12 }}>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 400, color: "#0a1628", lineHeight: 1.3 }}>Superbill Explainer</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.75, color: "#6b7d99", fontFamily: "var(--font-sans)", flexGrow: 1 }}>Step-by-step reimbursement guide customized to the patient's insurer.</p>
                  <div style={{ paddingTop: 12, borderTop: "1px solid #f0f0f0" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#4caf82", fontFamily: "var(--font-sans)", border: "1px solid #4caf82", padding: "2px 8px" }}>No PHI required</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Out-of-network</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Self-pay</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Patient-submitted claims</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Uses CPT codes</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Post-visit</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Print or email ready</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Front desk</span>
                    </div>
                    <div style={{ textAlign: "right" }}><span style={{ color: "#c41230", fontSize: 16 }}>→</span></div>
                  </div>
                </Link>
                <Link href="/discharge-billing-summary" className="tool-card" style={{ background: "#fff", border: "1px solid #e8d0d4", padding: "28px", display: "flex", flexDirection: "column", gap: 12 }}>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 400, color: "#0a1628", lineHeight: 1.3 }}>Discharge Billing Summary</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.75, color: "#6b7d99", fontFamily: "var(--font-sans)", flexGrow: 1 }}>After a procedure, explain what was billed and what to expect next.</p>
                  <div style={{ paddingTop: 12, borderTop: "1px solid #f0f0f0" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#4caf82", fontFamily: "var(--font-sans)", border: "1px solid #4caf82", padding: "2px 8px" }}>No PHI required</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Print or email ready</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Post-procedure</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Reduces patient disputes</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Uses CPT codes</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Insured & self-pay</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Billing staff</span>
                    </div>
                    <div style={{ textAlign: "right" }}><span style={{ color: "#c41230", fontSize: 16 }}>→</span></div>
                  </div>
                </Link>
                <Link href="/condition-explainer" className="tool-card" style={{ background: "#fff", border: "1px solid #e8d0d4", padding: "28px", display: "flex", flexDirection: "column", gap: 12 }}>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 400, color: "#0a1628", lineHeight: 1.3 }}>Condition Explainer</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.75, color: "#6b7d99", fontFamily: "var(--font-sans)", flexGrow: 1 }}>Plain-language patient education for any condition. Handouts, web, or portal.</p>
                  <div style={{ paddingTop: 12, borderTop: "1px solid #f0f0f0" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#4caf82", fontFamily: "var(--font-sans)", border: "1px solid #4caf82", padding: "2px 8px" }}>No PHI required</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>No billing codes needed</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Patient education</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Print or web ready</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Any patient type</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Clinical support staff</span>
                    </div>
                    <div style={{ textAlign: "right" }}><span style={{ color: "#c41230", fontSize: 16 }}>→</span></div>
                  </div>
                </Link>

            </div>

            <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b7d99", marginBottom: 20, fontFamily: "var(--font-sans)" }}>Internal Billing</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 48 }}>
                <Link href="/referral-letter" className="tool-card" style={{ background: "#fff", border: "2px solid #c41230", padding: "28px", display: "flex", flexDirection: "column", gap: 12 }}>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 400, color: "#0a1628", lineHeight: 1.3 }}>Referral Letter</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.75, color: "#6b7d99", fontFamily: "var(--font-sans)", flexGrow: 1 }}>Draft professional referral letters from specialty and clinical context.</p>
                  <div style={{ paddingTop: 12, borderTop: "1px solid #f0f0f0" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#4caf82", fontFamily: "var(--font-sans)", border: "1px solid #4caf82", padding: "2px 8px" }}>No PHI required</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Admin only — no clinical data</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Specialist referrals</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Print or email ready</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Pre-service</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Front desk</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Clinical support staff</span>
                    </div>
                    <div style={{ textAlign: "right" }}><span style={{ color: "#c41230", fontSize: 16 }}>→</span></div>
                  </div>
                </Link>
                <Link href="/denial-decoder" className="tool-card" style={{ background: "#fff", border: "2px solid #c41230", padding: "28px", display: "flex", flexDirection: "column", gap: 12 }}>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 400, color: "#0a1628", lineHeight: 1.3 }}>Denial Reason Decoder</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.75, color: "#6b7d99", fontFamily: "var(--font-sans)", flexGrow: 1 }}>Paste CARC/RARC codes. Get plain English, root cause, and next steps.</p>
                  <div style={{ paddingTop: 12, borderTop: "1px solid #f0f0f0" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#4caf82", fontFamily: "var(--font-sans)", border: "1px solid #4caf82", padding: "2px 8px" }}>No PHI required</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>CARC & RARC</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Remittance-based</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>High daily utility</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Post-adjudication</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Billing staff</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Uses EOB data</span>
                    </div>
                    <div style={{ textAlign: "right" }}><span style={{ color: "#c41230", fontSize: 16 }}>→</span></div>
                  </div>
                </Link>
                <Link href="/prior-auth-explainer" className="tool-card" style={{ background: "#fff", border: "2px solid #c41230", padding: "28px", display: "flex", flexDirection: "column", gap: 12 }}>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 400, color: "#0a1628", lineHeight: 1.3 }}>Prior Auth Explainer</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.75, color: "#6b7d99", fontFamily: "var(--font-sans)", flexGrow: 1 }}>Understand any auth denial instantly. Full appeal plan with documentation checklist.</p>
                  <div style={{ paddingTop: 12, borderTop: "1px solid #f0f0f0" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#4caf82", fontFamily: "var(--font-sans)", border: "1px solid #4caf82", padding: "2px 8px" }}>No PHI required</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Pre-service & post-denial</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Appeal ready</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Includes documentation checklist</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Uses CPT codes</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Payer-specific</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Billing staff</span>
                    </div>
                    <div style={{ textAlign: "right" }}><span style={{ color: "#c41230", fontSize: 16 }}>→</span></div>
                  </div>
                </Link>
                <Link href="/coverage-checker" className="tool-card" style={{ background: "#fff", border: "2px solid #c41230", padding: "28px", display: "flex", flexDirection: "column", gap: 12 }}>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 400, color: "#0a1628", lineHeight: 1.3 }}>Coverage & Code Checker</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.75, color: "#6b7d99", fontFamily: "var(--font-sans)", flexGrow: 1 }}>Check if a CPT/ICD-10 combination is covered by the payer. Get alternative codes if not.</p>
                  <div style={{ paddingTop: 12, borderTop: "1px solid #f0f0f0" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#4caf82", fontFamily: "var(--font-sans)", border: "1px solid #4caf82", padding: "2px 8px" }}>No PHI required</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>CPT & ICD-10</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Payer-specific</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Alternative codes</span>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7d99", fontFamily: "var(--font-sans)", border: "1px solid #dde3ed", padding: "2px 8px" }}>Billing staff</span>
                    </div>
                    <div style={{ textAlign: "right" }}><span style={{ color: "#c41230", fontSize: 16 }}>→</span></div>
                  </div>
                </Link>
            </div>
          </div>
                </div>
      </div>

      {/* How it works */}
      <div style={{ background: "#0a1628", padding: "96px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c41230", marginBottom: 16, fontFamily: "var(--font-sans)" }}>How it works</div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 40, fontWeight: 400, color: "#fff", marginBottom: 64, lineHeight: 1.2 }}>Three steps. Under a minute.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 48 }}>
            {[
              { n: "01", title: "Enter billing codes", body: "Input the CPT codes, payer, and any relevant plan details. No patient name, DOB, or record number required." },
              { n: "02", title: "AI generates output", body: "Claude reads the billing context and produces a plain-language summary, letter, or analysis in seconds." },
              { n: "03", title: "Copy, print, or send", body: "The result is ready to hand to a patient, file with a claim, or use in an appeal. One click to copy." },
            ].map(({ n, title, body }) => (
              <div key={n}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 64, fontWeight: 400, color: "rgba(196,18,48,0.3)", lineHeight: 1, marginBottom: 24 }}>{n}</div>
                <h3 style={{ fontSize: 20, fontWeight: 500, color: "#fff", marginBottom: 12, fontFamily: "var(--font-sans)" }}>{title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-sans)" }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance */}
      <div id="compliance" style={{ background: "#fff", padding: "96px 48px", borderTop: "1px solid #e8d0d4" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c41230", marginBottom: 16, fontFamily: "var(--font-sans)" }}>Compliance & Data</div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 40, fontWeight: 400, marginBottom: 24, lineHeight: 1.2 }}>Workflows designed to compliantly turn billing data into an asset</h2>
            <p style={{ fontSize: 15, lineHeight: 1.85, color: "#6b7d99", marginBottom: 24, fontFamily: "var(--font-sans)" }}>
              Every FlowMD workflow operates on billing codes and plan-level data — not patient records. No name, date of birth, or medical record number ever enters the system.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.85, color: "#6b7d99", fontFamily: "var(--font-sans)" }}>
              This isn&apos;t a workaround. It&apos;s the architecture. The same outputs a front office staff member produces manually — we just generate them faster.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              ["No patient name or DOB", "Workflows run on codes and plan data only"],
              ["No medical records", "Nothing that would constitute a designated record set"],
              ["No patient data stored", "Patient-identifiable information is never written to any database"],
              ["Audit-ready outputs", "Every document includes source data and a plain-language disclaimer"],
            ].map(([title, body]) => (
              <div key={title} style={{ display: "flex", gap: 16, padding: "16px 20px", border: "1px solid #e8d0d4", background: "#f8f8f8" }}>
                <span style={{ color: "#4caf82", fontSize: 16, flexShrink: 0, marginTop: 2 }}>✓</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#0a1628", marginBottom: 4, fontFamily: "var(--font-sans)" }}>{title}</div>
                  <div style={{ fontSize: 13, color: "#6b7d99", lineHeight: 1.6, fontFamily: "var(--font-sans)" }}>{body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Embed */}
      <div id="embed" style={{ background: "#0a1628", padding: "80px 48px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c41230", marginBottom: 16, fontFamily: "var(--font-sans)" }}>Embed on your site</div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 36, fontWeight: 400, color: "#fff", marginBottom: 20, lineHeight: 1.2 }}>One line of code.<br />Works on any website.</h2>
            <p style={{ fontSize: 15, lineHeight: 1.85, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-sans)" }}>
              Paste a single script tag into your practice website — Squarespace, WordPress, Webflow, or custom HTML. A patient-facing billing assistant appears instantly, branded to your practice. No developer required.
            </p>
          </div>
          <div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-sans)", display: "block", marginBottom: 8 }}>Practice name</label>
              <input
                type="text"
                placeholder="e.g. Riverside Cardiology"
                value={practiceName}
                onChange={e => setPracticeName(e.target.value)}
                style={{
                  width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.15)", color: "#fff",
                  fontFamily: "var(--font-sans)", fontSize: 14, outline: "none",
                }}
              />
            </div>
            <div style={{ position: "relative" }}>
              <label style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-sans)", display: "block", marginBottom: 8 }}>Your embed code</label>
              <div style={{
                background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)",
                padding: "16px", fontFamily: "monospace", fontSize: 12,
                color: "#4caf82", lineHeight: 1.6, wordBreak: "break-all",
                marginBottom: 12,
              }}>
                {scriptTag}
              </div>
              <button
                onClick={handleCopy}
                style={{
                  width: "100%", padding: "13px", background: copied ? "#4caf82" : "#c41230",
                  color: "#fff", border: "none", fontFamily: "var(--font-sans)",
                  fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase",
                  fontWeight: 500, cursor: "pointer", transition: "background 0.2s ease",
                }}
              >
                {copied ? "✓ Copied to clipboard" : "Copy embed code"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "linear-gradient(160deg, #c41230 0%, #8a0c20 100%)", padding: "80px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 40, fontWeight: 400, color: "#fff", marginBottom: 20, lineHeight: 1.2 }}>Ready to cut billing friction in half?</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", marginBottom: 40, lineHeight: 1.75, fontFamily: "var(--font-sans)" }}>Free during beta. No credit card. No setup. Works on the first day.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#tools" className="btn-primary" style={{ background: "#fff", color: "#c41230", padding: "14px 36px", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, fontFamily: "var(--font-sans)" }}>Get Access</a>
            <a href="#" className="btn-outline" style={{ background: "transparent", color: "rgba(255,255,255,0.8)", padding: "14px 36px", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.3)", fontFamily: "var(--font-sans)" }}>Book a Demo</a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: "#0a1628", padding: "32px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: 16, color: "rgba(255,255,255,0.4)" }}>FlowMD</span>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em", fontFamily: "var(--font-sans)" }}>Not a substitute for qualified billing staff or legal advice.</span>
      </div>
    </>
  );
}
