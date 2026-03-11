"use client";

import { useState } from "react";
import WorkflowLayout from "../components/WorkflowLayout";
import ResultPanel from "../components/ResultPanel";
import SendPanel from "../components/SendPanel";
import styles from "../workflow.module.css";

const PAYERS = ["Aetna","Anthem / Blue Cross Blue Shield","Cigna","Humana","Medicare","Medicaid","UnitedHealthcare","Kaiser Permanente","Molina Healthcare","Centene","CVS / Aetna","Elevance Health","Oscar Health","Other"];
const PLAN_TYPES = ["PPO","HMO","EPO","POS","HDHP","Medicare","Medicaid","Medicare Advantage","Other"];

export default function CoverageCheckerPage() {
  const [cptCode, setCptCode] = useState("");
  const [icdCode, setIcdCode] = useState("");
  const [payer, setPayer] = useState("");
  const [planType, setPlanType] = useState("");
  const [result, setResult] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!cptCode || !icdCode || !payer) { setError("CPT code, ICD-10 code, and payer are required."); return; }
    setError(""); setLoading(true); setStreaming(true); setResult("");
    try {
      const res = await fetch("/api/coverage-checker", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cptCode, icdCode, payer, planType }),
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
          <span className={styles.workflowLabel}>10 — Coverage & Code Checker</span>
        </div>
        <div className={styles.workflowMain}>
          <div className={styles.left}>
            <h1 className={styles.title}>Coverage &<br />Code Checker</h1>
            <p className={styles.subtitle}>Enter a CPT and ICD-10 code to check if the combination is typically covered by the payer. Get alternative codes if not.</p>
            <div className={styles.form}>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>CPT Code<span className={styles.hint}>Procedure code to verify</span></label>
                  <input className={styles.input} type="text" placeholder="e.g. 93000" value={cptCode} onChange={e => setCptCode(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>ICD-10 Code<span className={styles.hint}>Diagnosis code</span></label>
                  <input className={styles.input} type="text" placeholder="e.g. I25.10" value={icdCode} onChange={e => setIcdCode(e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Payer<span className={styles.hint}>Insurance company</span></label>
                  <select className={styles.select} value={payer} onChange={e => setPayer(e.target.value)}>
                    <option value="">Select payer…</option>
                    {PAYERS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Plan Type <span className={styles.optional}>(optional)</span><span className={styles.hint}>Improves specificity</span></label>
                  <select className={styles.select} value={planType} onChange={e => setPlanType(e.target.value)}>
                    <option value="">Select plan type…</option>
                    {PLAN_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              {error && <div className={styles.error}>{error}</div>}
              <button className={styles.button} onClick={handleSubmit} disabled={loading || streaming}>
                {loading || streaming ? "Checking…" : "Check Coverage"}
              </button>
            </div>
          </div>
          <div className={styles.right}>
            <ResultPanel result={result} streaming={streaming} loading={loading}
              placeholderTitle="Coverage analysis will appear here"
              placeholderBody="Includes coverage likelihood, common denial reasons, alternative codes, and ICD-10 specificity check."
              resultLabel="Coverage Analysis"
              disclaimer="Coverage patterns only — verify with payer before rendering services."
              historyKey="coverage-checker" />
              <SendPanel
                result={result}
                resultLabel="Coverage Analysis"
                workflowName="Coverage & Code Checker"
                isPatientFacing={false}
              />
          </div>
        </div>
      </div>
    </WorkflowLayout>
  );
}
