"use client";

import { useState } from "react";
import WorkflowLayout from "../components/WorkflowLayout";
import ResultPanel from "../components/ResultPanel";
import SendPanel from "../components/SendPanel";
import styles from "../workflow.module.css";

const PLAN_TYPES = ["PPO","HMO","EPO","POS","HDHP","Medicare","Medicaid","Medicare Advantage","Other"];
const PAYERS = ["Aetna","Anthem / Blue Cross Blue Shield","Cigna","Humana","Medicare","Medicaid","UnitedHealthcare","Kaiser Permanente","Molina Healthcare","Centene","CVS / Aetna","Elevance Health","Oscar Health","Other"];
const COINSURANCE = ["100% (no coinsurance)","90/10","80/20","70/30","60/40","50/50"];

export default function PreTreatmentPage() {
  const [planType, setPlanType] = useState("");
  const [payer, setPayer] = useState("");
  const [cptCodes, setCptCodes] = useState("");
  const [deductible, setDeductible] = useState("");
  const [deductibleMet, setDeductibleMet] = useState("");
  const [coinsurance, setCoinsurance] = useState("");
  const [copay, setCopay] = useState("");
  const [oopMax, setOopMax] = useState("");
  const [oopMet, setOopMet] = useState("");
  const [result, setResult] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!planType || !cptCodes) { setError("Plan type and CPT codes are required."); return; }
    setError(""); setLoading(true); setStreaming(true); setResult("");
    try {
      const res = await fetch("/api/pre-treatment", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType, payer, cptCodes, deductible, deductibleMet, coinsurance, copay, oopMax, oopMet }),
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
          <span className={styles.workflowLabel}>01 — Pre-Treatment Estimator</span>
        </div>
        <div className={styles.workflowMain}>
          <div className={styles.left}>
            <h1 className={styles.title}>Pre-Treatment<br />Estimator</h1>
            <p className={styles.subtitle}>Enter the insurance plan and billing codes. Get a plain-language coverage summary and out-of-pocket estimate to share with the patient before their visit.</p>
            <div className={styles.form}>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Plan Type<span className={styles.hint}>Found on the insurance card</span></label>
                  <select className={styles.select} value={planType} onChange={e => setPlanType(e.target.value)}>
                    <option value="">Select plan type…</option>
                    {PLAN_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Payer <span className={styles.optional}>(optional)</span><span className={styles.hint}>Insurance company</span></label>
                  <select className={styles.select} value={payer} onChange={e => setPayer(e.target.value)}>
                    <option value="">Select payer…</option>
                    {PAYERS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>CPT Codes<span className={styles.hint}>Enter codes separated by commas — e.g. 93000, 99213</span></label>
                <input className={styles.input} type="text" placeholder="e.g. 93000, 99213" value={cptCodes} onChange={e => setCptCodes(e.target.value)} />
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Annual Deductible <span className={styles.optional}>(optional)</span></label>
                  <input className={styles.input} type="text" placeholder="e.g. 1500" value={deductible} onChange={e => setDeductible(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Deductible Met <span className={styles.optional}>(optional)</span></label>
                  <input className={styles.input} type="text" placeholder="e.g. 400" value={deductibleMet} onChange={e => setDeductibleMet(e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Coinsurance <span className={styles.optional}>(optional)</span></label>
                  <select className={styles.select} value={coinsurance} onChange={e => setCoinsurance(e.target.value)}>
                    <option value="">Select…</option>
                    {COINSURANCE.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Copay <span className={styles.optional}>(optional)</span></label>
                  <input className={styles.input} type="text" placeholder="e.g. 30" value={copay} onChange={e => setCopay(e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Out-of-Pocket Max <span className={styles.optional}>(optional)</span></label>
                  <input className={styles.input} type="text" placeholder="e.g. 5000" value={oopMax} onChange={e => setOopMax(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>OOP Max Met <span className={styles.optional}>(optional)</span></label>
                  <input className={styles.input} type="text" placeholder="e.g. 400" value={oopMet} onChange={e => setOopMet(e.target.value)} />
                </div>
              </div>
              {error && <div className={styles.error}>{error}</div>}
              <button className={styles.button} onClick={handleSubmit} disabled={loading || streaming}>
                {loading || streaming ? "Generating estimate…" : "Generate Coverage Summary"}
              </button>
            </div>
          </div>
          <div className={styles.right}>
            <ResultPanel result={result} streaming={streaming} loading={loading}
              placeholderTitle="Coverage summary will appear here"
              placeholderBody="Plain-language estimate of what the patient will owe based on their plan details."
              resultLabel="Coverage Estimate"
              disclaimer="This is an estimate only and does not guarantee coverage or payment. Verify benefits with the payer before communicating to patients."
              historyKey="pre-treatment" />
              <SendPanel
                result={result}
                resultLabel="Coverage Estimate"
                workflowName="Pre-Treatment Estimator"
                practiceName=""
                isPatientFacing={true}
              />
          </div>
        </div>
      </div>
    </WorkflowLayout>
  );
}
