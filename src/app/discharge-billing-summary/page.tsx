"use client";

import { useState } from "react";
import WorkflowLayout from "../components/WorkflowLayout";
import ResultPanel from "../components/ResultPanel";
import SendPanel from "../components/SendPanel";
import styles from "../workflow.module.css";

const PROCEDURE_TYPES = ["Office visit","Outpatient surgery","Inpatient admission","Diagnostic imaging","Lab / pathology","Endoscopy / colonoscopy","Cardiac catheterization","Physical therapy","Other"];
const PAYERS = ["Aetna","Anthem / Blue Cross Blue Shield","Cigna","Humana","Medicare","Medicaid","UnitedHealthcare","Kaiser Permanente","Molina Healthcare","Centene","CVS / Aetna","Elevance Health","Oscar Health","Other"];

export default function DischargeBillingSummaryPage() {
  const [providerName, setProviderName] = useState("");
  const [payer, setPayer] = useState("");
  const [procedureType, setProcedureType] = useState("");
  const [cptCodes, setCptCodes] = useState("");
  const [totalBilled, setTotalBilled] = useState("");
  const [insurerPaid, setInsurerPaid] = useState("");
  const [patientOwes, setPatientOwes] = useState("");
  const [followUpCharges, setFollowUpCharges] = useState("");
  const [result, setResult] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!procedureType || !totalBilled) { setError("Procedure type and total billed are required."); return; }
    setError(""); setLoading(true); setStreaming(true); setResult("");
    try {
      const res = await fetch("/api/discharge-billing-summary", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerName, payer, procedureType, cptCodes, totalBilled, insurerPaid, patientOwes, followUpCharges }),
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
          <span className={styles.workflowLabel}>05 — Discharge Billing Summary</span>
        </div>
        <div className={styles.workflowMain}>
          <div className={styles.left}>
            <h1 className={styles.title}>Discharge Billing<br />Summary</h1>
            <p className={styles.subtitle}>After a procedure or hospital stay, generate a plain-language billing summary explaining what was done, what was billed, and what follow-up charges to expect.</p>
            <div className={styles.form}>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Facility / Practice Name <span className={styles.optional}>(optional)</span></label>
                  <input className={styles.input} type="text" placeholder="e.g. Riverside Cardiology" value={providerName} onChange={e => setProviderName(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Payer <span className={styles.optional}>(optional)</span></label>
                  <select className={styles.select} value={payer} onChange={e => setPayer(e.target.value)}>
                    <option value="">Select payer…</option>
                    {PAYERS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Procedure Type<span className={styles.hint}>General category — no patient details</span></label>
                <select className={styles.select} value={procedureType} onChange={e => setProcedureType(e.target.value)}>
                  <option value="">Select procedure type…</option>
                  {PROCEDURE_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>CPT Codes <span className={styles.optional}>(optional)</span><span className={styles.hint}>Comma-separated</span></label>
                <input className={styles.input} type="text" placeholder="e.g. 45378, 45380" value={cptCodes} onChange={e => setCptCodes(e.target.value)} />
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Total Billed</label>
                  <input className={styles.input} type="text" placeholder="e.g. 3200" value={totalBilled} onChange={e => setTotalBilled(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Insurer Paid <span className={styles.optional}>(optional)</span></label>
                  <input className={styles.input} type="text" placeholder="e.g. 2400" value={insurerPaid} onChange={e => setInsurerPaid(e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Patient Owes <span className={styles.optional}>(optional)</span></label>
                  <input className={styles.input} type="text" placeholder="e.g. 800" value={patientOwes} onChange={e => setPatientOwes(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Expected Follow-Up Charges <span className={styles.optional}>(optional)</span></label>
                  <input className={styles.input} type="text" placeholder="e.g. Pathology, anesthesia" value={followUpCharges} onChange={e => setFollowUpCharges(e.target.value)} />
                </div>
              </div>
              {error && <div className={styles.error}>{error}</div>}
              <button className={styles.button} onClick={handleSubmit} disabled={loading || streaming}>
                {loading || streaming ? "Generating summary…" : "Generate Discharge Summary"}
              </button>
            </div>
          </div>
          <div className={styles.right}>
            <ResultPanel result={result} streaming={streaming} loading={loading}
              placeholderTitle="Discharge billing summary will appear here"
              placeholderBody="Plain-language explanation of the procedure billing, what insurance paid, and what to expect next."
              resultLabel="Discharge Summary"
              disclaimer="Review before distributing. This is a plain-language summary only and does not constitute a bill or legal notice."
              historyKey="discharge-billing" />
              <SendPanel
                result={result}
                resultLabel="Discharge Summary"
                workflowName="Discharge Billing Summary"
                practiceName=""
                isPatientFacing={true}
              />
          </div>
        </div>
      </div>
    </WorkflowLayout>
  );
}
