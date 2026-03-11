"use client";

import { useState } from "react";
import WorkflowLayout from "../components/WorkflowLayout";
import ResultPanel from "../components/ResultPanel";
import SendPanel from "../components/SendPanel";
import styles from "../workflow.module.css";

const COMMON_CONDITIONS = [
  "High Blood Pressure (Hypertension)","Heart Attack (Myocardial Infarction)",
  "Chest Pain (Angina)","Leg Pain (Peripheral Artery Disease)",
  "High Cholesterol (Hyperlipidemia)","Heart Palpitations",
  "Dizziness / Vertigo","Shortness of Breath (Dyspnea)",
  "Heart Failure (Congestive Heart Failure)","Atrial Fibrillation",
  "Coronary Artery Disease","Stroke / TIA","Diabetes (Type 2)",
  "Sleep Apnea","Aortic Stenosis","Other (enter below)"
];

export default function ConditionExplainerPage() {
  const [condition, setCondition] = useState("");
  const [customCondition, setCustomCondition] = useState("");
  const [readingLevel, setReadingLevel] = useState("Plain English (6th grade)");
  const [format, setFormat] = useState("Patient handout (print-ready)");
  const [practiceName, setPracticeName] = useState("");
  const [includeWhenToSeekCare, setIncludeWhenToSeekCare] = useState(true);
  const [includeDietLifestyle, setIncludeDietLifestyle] = useState(true);
  const [includeHowDiagnosed, setIncludeHowDiagnosed] = useState(false);
  const [includeTreatmentOverview, setIncludeTreatmentOverview] = useState(false);
  const [result, setResult] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const conditionToUse = condition === "Other (enter below)" ? customCondition : condition;
    if (!conditionToUse) { setError("Please select or enter a condition."); return; }
    setError(""); setLoading(true); setStreaming(true); setResult("");
    try {
      const res = await fetch("/api/condition-explainer", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ condition, customCondition, conditionToUse, readingLevel, format, practiceName, includeWhenToSeekCare, includeDietLifestyle, includeHowDiagnosed, includeTreatmentOverview }),
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
          <span className={styles.workflowLabel}>06 — Condition Explainer</span>
        </div>
        <div className={styles.workflowMain}>
          <div className={styles.left}>
            <h1 className={styles.title}>Condition<br />Explainer</h1>
            <p className={styles.subtitle}>Generate plain-language patient education content for any condition your practice treats.</p>
            <div className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Condition</label>
                <select className={styles.select} value={condition} onChange={e => setCondition(e.target.value)}>
                  <option value="">Select condition…</option>
                  {COMMON_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {condition === "Other (enter below)" && (
                <div className={styles.field}>
                  <label className={styles.label}>Enter Condition</label>
                  <input className={styles.input} type="text" placeholder="e.g. Mitral Valve Prolapse" value={customCondition} onChange={e => setCustomCondition(e.target.value)} />
                </div>
              )}
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Reading Level</label>
                  <select className={styles.select} value={readingLevel} onChange={e => setReadingLevel(e.target.value)}>
                    <option>Plain English (6th grade)</option>
                    <option>General adult (8th–10th grade)</option>
                    <option>Detailed / health-literate adult</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Format</label>
                  <select className={styles.select} value={format} onChange={e => setFormat(e.target.value)}>
                    <option>Patient handout (print-ready)</option>
                    <option>Website page content</option>
                    <option>FAQ style (questions and answers)</option>
                    <option>Brief summary (one paragraph)</option>
                  </select>
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Practice Name <span className={styles.optional}>(optional)</span><span className={styles.hint}>Added to the footer of patient handouts</span></label>
                <input className={styles.input} type="text" placeholder="Riverside Cardiology" value={practiceName} onChange={e => setPracticeName(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Include Sections</label>
                <div className={styles.checkboxGroup}>
                  {[
                    ["includeWhenToSeekCare","When to seek care / warning signs", includeWhenToSeekCare, setIncludeWhenToSeekCare],
                    ["includeDietLifestyle","Diet and lifestyle tips", includeDietLifestyle, setIncludeDietLifestyle],
                    ["includeHowDiagnosed","How it is diagnosed", includeHowDiagnosed, setIncludeHowDiagnosed],
                    ["includeTreatmentOverview","Treatment overview", includeTreatmentOverview, setIncludeTreatmentOverview],
                  ].map(([key, label, val, setter]) => (
                    <label key={key as string} className={styles.checkboxLabel}>
                      <input type="checkbox" className={styles.checkbox} checked={val as boolean} onChange={e => (setter as (v: boolean) => void)(e.target.checked)} />
                      {label as string}
                    </label>
                  ))}
                </div>
              </div>
              {error && <div className={styles.error}>{error}</div>}
              <button className={styles.button} onClick={handleSubmit} disabled={loading || streaming}>
                {loading || streaming ? "Generating content…" : "Generate Patient Education Content"}
              </button>
            </div>
          </div>
          <div className={styles.right}>
            <ResultPanel result={result} streaming={streaming} loading={loading}
              placeholderTitle="Patient education content will appear here"
              placeholderBody="Suitable for patient handouts, website pages, or portal content."
              resultLabel="Patient Education Content"
              disclaimer="Review before publishing or distributing. A licensed clinician should review before use."
              historyKey="condition-explainer" />
              <SendPanel
                result={result}
                resultLabel="Condition Summary"
                workflowName="Condition Summary"
                isPatientFacing={true}
              />
          </div>
        </div>
      </div>
    </WorkflowLayout>
  );
}
