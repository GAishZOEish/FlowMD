"use client";

import { useState } from "react";
import WorkflowLayout from "../components/WorkflowLayout";
import ResultPanel from "../components/ResultPanel";
import SendPanel from "../components/SendPanel";
import styles from "../workflow.module.css";

const PAYERS = ["Aetna","Anthem / Blue Cross Blue Shield","Cigna","Humana","Medicare","Medicaid","UnitedHealthcare","Kaiser Permanente","Molina Healthcare","Centene","CVS / Aetna","Elevance Health","Oscar Health","Other"];
const ADJUSTMENT_REASONS = ["Deductible not met","Coinsurance","Copay","Non-covered service","Out-of-network","Partial denial — medical necessity","Claim denied — duplicate","Claim denied — timely filing","Contractual adjustment","Other"];

export default function PostTreatmentPage() {
  const [serviceDate, setServiceDate] = useState("");
  const [providerName, setProviderName] = useState("");
  const [payer, setPayer] = useState("");
  const [cptCodes, setCptCodes] = useState("");
  const [totalBilled, setTotalBilled] = useState("");
  const [insurerPaid, setInsurerPaid] = useState("");
  const [adjustments, setAdjustments] = useState("");
  const [patientOwes, setPatientOwes] = useState("");
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [result, setResult] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!cptCodes || !totalBilled) { setError("CPT codes and total billed are required."); return; }
    setError(""); setLoading(true); setStreaming(true); setResult("");
    try {
      const res = await fetch("/api/post-treatment", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceDate, providerName, payer, cptCodes, totalBilled, insurerPaid, adjustments, patientOwes, adjustmentReason }),
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
          <span className={styles.workflowLabel}>02 — Post-Adjudication Letter</span>
        </div>
        <div className={styles.workflowMain}>
          <div className={styles.left}>
            <h1 className={styles.title}>Post-Adjudication<br />Letter</h1>
            <p className={styles.subtitle}>Enter EOB data. Generate a plain-language letter explaining what happened, what the patient owes, and why.</p>
            <div className={styles.form}>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Service Date <span className={styles.optional}>(optional)</span></label>
                  <input className={styles.input} type="text" placeholder="e.g. March 1, 2026" value={serviceDate} onChange={e => setServiceDate(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Provider / Practice Name <span className={styles.optional}>(optional)</span></label>
                  <input className={styles.input} type="text" placeholder="e.g. Riverside Cardiology" value={providerName} onChange={e => setProviderName(e.target.value)} />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Payer <span className={styles.optional}>(optional)</span></label>
                <select className={styles.select} value={payer} onChange={e => setPayer(e.target.value)}>
                  <option value="">Select payer…</option>
                  {PAYERS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>CPT Codes<span className={styles.hint}>Comma-separated — e.g. 99213, 93000</span></label>
                <input className={styles.input} type="text" placeholder="e.g. 99213, 93000" value={cptCodes} onChange={e => setCptCodes(e.target.value)} />
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Total Billed<span className={styles.hint}>Total charged by the practice</span></label>
                  <input className={styles.input} type="text" placeholder="e.g. 250" value={totalBilled} onChange={e => setTotalBilled(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Insurer Paid <span className={styles.optional}>(optional)</span></label>
                  <input className={styles.input} type="text" placeholder="e.g. 148" value={insurerPaid} onChange={e => setInsurerPaid(e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Adjustments <span className={styles.optional}>(optional)</span><span className={styles.hint}>Contractual write-offs</span></label>
                  <input className={styles.input} type="text" placeholder="e.g. 65" value={adjustments} onChange={e => setAdjustments(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Patient Owes <span className={styles.optional}>(optional)</span></label>
                  <input className={styles.input} type="text" placeholder="e.g. 37" value={patientOwes} onChange={e => setPatientOwes(e.target.value)} />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Adjustment Reason <span className={styles.optional}>(optional)</span></label>
                <select className={styles.select} value={adjustmentReason} onChange={e => setAdjustmentReason(e.target.value)}>
                  <option value="">Select reason…</option>
                  {ADJUSTMENT_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              {error && <div className={styles.error}>{error}</div>}
              <button className={styles.button} onClick={handleSubmit} disabled={loading || streaming}>
                {loading || streaming ? "Generating letter…" : "Generate Patient Letter"}
              </button>
            </div>
          </div>
          <div className={styles.right}>
            <ResultPanel result={result} streaming={streaming} loading={loading}
              placeholderTitle="Patient letter will appear here"
              placeholderBody="Plain-language explanation of what was billed, what insurance paid, and what the patient owes."
              resultLabel="Patient Letter"
              disclaimer="Review before sending to patients. This letter is a plain-language summary only and does not constitute a bill or legal notice."
              historyKey="post-treatment" />
              <SendPanel
                result={result}
                resultLabel="Patient Letter"
                workflowName="Post-Adjudication Letter"
                practiceName=""
                isPatientFacing={true}
              />
          </div>
        </div>
      </div>
    </WorkflowLayout>
  );
}
