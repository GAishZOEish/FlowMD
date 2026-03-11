"use client";

import { useState } from "react";
import WorkflowLayout from "../components/WorkflowLayout";
import ResultPanel from "../components/ResultPanel";
import SendPanel from "../components/SendPanel";
import styles from "../workflow.module.css";

const PAYERS = ["Aetna","Anthem / Blue Cross Blue Shield","Cigna","Humana","Medicare","Medicaid","UnitedHealthcare","Kaiser Permanente","Molina Healthcare","Centene","CVS / Aetna","Elevance Health","Oscar Health","Other"];

export default function DenialDecoderPage() {
  const [carc, setCarc] = useState("");
  const [rarc, setRarc] = useState("");
  const [payer, setPayer] = useState("");
  const [cptCodes, setCptCodes] = useState("");
  const [result, setResult] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!carc) { setError("Enter at least one CARC code."); return; }
    setError(""); setLoading(true); setStreaming(true); setResult("");
    try {
      const res = await fetch("/api/denial-decoder", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carc, rarc, payer, cptCode: cptCodes }),
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
          <span className={styles.workflowLabel}>08 — Denial Reason Decoder</span>
        </div>
        <div className={styles.workflowMain}>
          <div className={styles.left}>
            <h1 className={styles.title}>Denial Reason<br />Decoder</h1>
            <p className={styles.subtitle}>Paste CARC and RARC codes from a remittance. Get plain English on why the claim was denied and what to do next.</p>
            <div className={styles.form}>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>CARC Code<span className={styles.hint}>From your remittance — e.g. 97, 4, 18</span></label>
                  <input className={styles.input} type="text" placeholder="e.g. 97" value={carc} onChange={e => setCarc(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>RARC Code <span className={styles.optional}>(optional)</span><span className={styles.hint}>Secondary remark — e.g. N95, MA01</span></label>
                  <input className={styles.input} type="text" placeholder="e.g. N130" value={rarc} onChange={e => setRarc(e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Payer <span className={styles.optional}>(optional)</span><span className={styles.hint}>Improves specificity</span></label>
                  <select className={styles.select} value={payer} onChange={e => setPayer(e.target.value)}>
                    <option value="">Select payer…</option>
                    {PAYERS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>CPT Code <span className={styles.optional}>(optional)</span><span className={styles.hint}>Procedure that was denied</span></label>
                  <input className={styles.input} type="text" placeholder="e.g. 99215" value={cptCodes} onChange={e => setCptCodes(e.target.value)} />
                </div>
              </div>
              {error && <div className={styles.error}>{error}</div>}
              <button className={styles.button} onClick={handleSubmit} disabled={loading || streaming}>
                {loading || streaming ? "Decoding…" : "Decode Denial"}
              </button>
            </div>
          </div>
          <div className={styles.right}>
            <ResultPanel result={result} streaming={streaming} loading={loading}
              placeholderTitle="Denial analysis will appear here"
              placeholderBody="Includes what the code means, why it triggered, and step-by-step remedies."
              resultLabel="Denial Analysis"
              disclaimer="General explanation based on standard code definitions. Verify remedies against the specific payer's guidelines before resubmitting."
              historyKey="denial-decoder" />
              <SendPanel
                result={result}
                resultLabel="Denial Analysis"
                workflowName="Denial Analysis"
                isPatientFacing={false}
              />
          </div>
        </div>
      </div>
    </WorkflowLayout>
  );
}
