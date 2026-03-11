"use client";

import { useState } from "react";
import WorkflowLayout from "../components/WorkflowLayout";
import ResultPanel from "../components/ResultPanel";
import SendPanel from "../components/SendPanel";
import styles from "../workflow.module.css";

const PAYERS = ["Aetna","Anthem / Blue Cross Blue Shield","Cigna","Humana","Medicare","Medicaid","UnitedHealthcare","Kaiser Permanente","Molina Healthcare","Centene","CVS / Aetna","Elevance Health","Oscar Health","Other"];
const DENIAL_TYPES = ["Not medically necessary","Service requires prior authorization","Authorization was not obtained","Authorization expired","Authorization for different procedure","Non-covered service","Out-of-network provider","Missing or incomplete clinical documentation","Other / I have the denial letter text"];

export default function PriorAuthExplainerPage() {
  const [cptCodes, setCptCodes] = useState("");
  const [payer, setPayer] = useState("");
  const [denialType, setDenialType] = useState("");
  const [denialText, setDenialText] = useState("");
  const [result, setResult] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!cptCodes || !payer || !denialType) { setError("CPT code, payer, and denial reason are required."); return; }
    setError(""); setLoading(true); setStreaming(true); setResult("");
    try {
      const res = await fetch("/api/prior-auth-explainer", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cptCode: cptCodes, payer, denialType, denialText }),
      });
      if (!res.ok) throw new Error("Request failed");
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      setLoading(false);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setResult(prev => prev + decoder.decode(value));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally { setLoading(false); setStreaming(false); }
  };

  return (
    <WorkflowLayout>
      <div className={styles.workflowPage}>
        <div className={styles.workflowHeader}>
          <span className={styles.workflowLabel}>09 — Prior Auth Explainer</span>
        </div>
        <div className={styles.workflowMain}>
          <div className={styles.left}>
            <h1 className={styles.title}>Prior Auth<br />Explainer</h1>
            <p className={styles.subtitle}>Enter a procedure code, payer, and denial reason. Get a clear explanation and a step-by-step appeal plan.</p>
            <div className={styles.form}>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>CPT Code<span className={styles.hint}>Procedure that was denied</span></label>
                  <input className={styles.input} type="text" placeholder="e.g. 70553" value={cptCodes} onChange={e => setCptCodes(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Payer<span className={styles.hint}>Insurance company name</span></label>
                  <select className={styles.select} value={payer} onChange={e => setPayer(e.target.value)}>
                    <option value="">Select payer…</option>
                    {PAYERS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Denial Reason<span className={styles.hint}>Select the closest match from your denial letter</span></label>
                <select className={styles.select} value={denialType} onChange={e => setDenialType(e.target.value)}>
                  <option value="">Select reason…</option>
                  {DENIAL_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              {denialType === "Other / I have the denial letter text" && (
                <div className={styles.field}>
                  <label className={styles.label}>Paste Denial Text<span className={styles.hint}>Remove any patient name or ID before pasting</span></label>
                  <textarea className={styles.textarea} rows={5}
                    placeholder="Paste the relevant portion of the denial letter here…"
                    value={denialText} onChange={e => setDenialText(e.target.value)} />
                </div>
              )}
              {error && <div className={styles.error}>{error}</div>}
              <button className={styles.button} onClick={handleSubmit} disabled={loading || streaming}>
                {loading || streaming ? "Analyzing…" : "Explain Denial & Appeal Options"}
              </button>
            </div>
          </div>
          <div className={styles.right}>
            <ResultPanel result={result} streaming={streaming} loading={loading}
              placeholderTitle="Prior auth analysis will appear here"
              placeholderBody="Includes why auth was required, appeal paths, timelines, and a documentation checklist."
              resultLabel="Prior Auth Analysis"
              disclaimer="Appeal timelines vary by payer and plan. Verify all deadlines directly with the payer before submitting an appeal."
              historyKey="prior-auth" />
          </div>
        </div>
      </div>
    </WorkflowLayout>
  );
}
