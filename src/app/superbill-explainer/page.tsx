"use client";

import { useState } from "react";
import WorkflowLayout from "../components/WorkflowLayout";
import ResultPanel from "../components/ResultPanel";
import SendPanel from "../components/SendPanel";
import styles from "../workflow.module.css";

const PAYERS = ["Aetna","Anthem / Blue Cross Blue Shield","Cigna","Humana","Medicare","Medicaid","UnitedHealthcare","Kaiser Permanente","Molina Healthcare","Centene","CVS / Aetna","Elevance Health","Oscar Health","Other"];
const PLAN_TYPES = ["PPO","HMO","EPO","POS","HDHP","Medicare","Medicaid","Medicare Advantage","Other"];

export default function SuperbillExplainerPage() {
  const [payer, setPayer] = useState("");
  const [planType, setPlanType] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [cptCodes, setCptCodes] = useState("");
  const [totalBilled, setTotalBilled] = useState("");
  const [result, setResult] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!cptCodes || !totalBilled) { setError("CPT codes and total amount are required."); return; }
    setError(""); setLoading(true); setStreaming(true); setResult("");
    try {
      const res = await fetch("/api/superbill-explainer", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payer, planType, serviceDate, cptCodes, totalBilled }),
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
          <span className={styles.workflowLabel}>04 — Superbill Explainer</span>
        </div>
        <div className={styles.workflowMain}>
          <div className={styles.left}>
            <h1 className={styles.title}>Superbill<br />Explainer</h1>
            <p className={styles.subtitle}>Out-of-network or self-pay patients receive a superbill but rarely know what to do with it. Generate a plain-language submission guide customized to their insurer.</p>
            <div className={styles.form}>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Payer<span className={styles.hint}>Patient's insurance company</span></label>
                  <select className={styles.select} value={payer} onChange={e => setPayer(e.target.value)}>
                    <option value="">Select payer…</option>
                    {PAYERS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Plan Type <span className={styles.optional}>(optional)</span></label>
                  <select className={styles.select} value={planType} onChange={e => setPlanType(e.target.value)}>
                    <option value="">Select plan type…</option>
                    {PLAN_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>CPT Codes<span className={styles.hint}>Services on the superbill — comma separated</span></label>
                <input className={styles.input} type="text" placeholder="e.g. 99214, 93000" value={cptCodes} onChange={e => setCptCodes(e.target.value)} />
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Service Date <span className={styles.optional}>(optional)</span></label>
                  <input className={styles.input} type="text" placeholder="e.g. March 1, 2026" value={serviceDate} onChange={e => setServiceDate(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Total Billed <span className={styles.optional}>(optional)</span></label>
                  <input className={styles.input} type="text" placeholder="e.g. 450" value={totalBilled} onChange={e => setTotalBilled(e.target.value)} />
                </div>
              </div>
              {error && <div className={styles.error}>{error}</div>}
              <button className={styles.button} onClick={handleSubmit} disabled={loading || streaming}>
                {loading || streaming ? "Generating guide…" : "Generate Submission Guide"}
              </button>
            </div>
          </div>
          <div className={styles.right}>
            <ResultPanel result={result} streaming={streaming} loading={loading}
              placeholderTitle="Submission guide will appear here"
              placeholderBody="Step-by-step instructions for the patient to submit their superbill to their insurer."
              resultLabel="Superbill Guide"
              disclaimer="Submission procedures vary by plan. Patient should verify their specific out-of-network claims process before submitting."
              historyKey="superbill-explainer" />
              <SendPanel
                result={result}
                resultLabel="Superbill Guide"
                workflowName="Superbill Explainer"
                practiceName=""
                isPatientFacing={true}
              />
          </div>
        </div>
      </div>
    </WorkflowLayout>
  );
}
