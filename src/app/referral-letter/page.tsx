"use client";

import { useState } from "react";
import WorkflowLayout from "../components/WorkflowLayout";
import ResultPanel from "../components/ResultPanel";
import SendPanel from "../components/SendPanel";
import styles from "../workflow.module.css";

const SPECIALTIES = ["Cardiology","Interventional Cardiology","Electrophysiology","Cardiac Surgery","Pulmonology","Gastroenterology","Nephrology","Endocrinology","Neurology","Orthopedic Surgery","Vascular Surgery","Rheumatology","Oncology","Hematology","Urology","Dermatology","Ophthalmology","ENT (Otolaryngology)","Physical Therapy","Pain Management","Other"];

export default function ReferralLetterPage() {
  const [fromPractice, setFromPractice] = useState("");
  const [toPractice, setToPractice] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [referralReason, setReferralReason] = useState("");
  const [relevantHistory, setRelevantHistory] = useState("");
  const [urgency, setUrgency] = useState("Routine");
  const [result, setResult] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!specialty || !referralReason) { setError("Specialty and reason for referral are required."); return; }
    setError(""); setLoading(true); setStreaming(true); setResult("");
    try {
      const res = await fetch("/api/referral-letter", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromPractice, toPractice, specialty, referralReason, relevantHistory, urgency }),
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
          <span className={styles.workflowLabel}>07 — Referral Letter</span>
        </div>
        <div className={styles.workflowMain}>
          <div className={styles.left}>
            <h1 className={styles.title}>Referral<br />Letter</h1>
            <p className={styles.subtitle}>Draft a professional referral letter from specialty, reason for referral, and relevant history. Saves physician time on routine correspondence.</p>
            <div className={styles.form}>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Referring Practice <span className={styles.optional}>(optional)</span></label>
                  <input className={styles.input} type="text" placeholder="e.g. Riverside Cardiology" value={fromPractice} onChange={e => setFromPractice(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Receiving Practice <span className={styles.optional}>(optional)</span></label>
                  <input className={styles.input} type="text" placeholder="e.g. Bay Surgical Associates" value={toPractice} onChange={e => setToPractice(e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Specialty<span className={styles.hint}>The specialty being referred to</span></label>
                  <select className={styles.select} value={specialty} onChange={e => setSpecialty(e.target.value)}>
                    <option value="">Select specialty…</option>
                    {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Urgency</label>
                  <select className={styles.select} value={urgency} onChange={e => setUrgency(e.target.value)}>
                    <option value="Routine">Routine</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Emergent">Emergent</option>
                  </select>
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Reason for Referral<span className={styles.hint}>Clinical reason — no patient name or DOB needed</span></label>
                <textarea className={styles.textarea} rows={3}
                  placeholder="e.g. Chest pain on exertion, rule out coronary artery disease…"
                  value={referralReason} onChange={e => setReferralReason(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Relevant History <span className={styles.optional}>(optional)</span><span className={styles.hint}>Clinical context — no patient identifiers</span></label>
                <textarea className={styles.textarea} rows={3}
                  placeholder="e.g. Hypertension, hyperlipidemia, smoker. On lisinopril 10mg…"
                  value={relevantHistory} onChange={e => setRelevantHistory(e.target.value)} />
              </div>
              {error && <div className={styles.error}>{error}</div>}
              <button className={styles.button} onClick={handleSubmit} disabled={loading || streaming}>
                {loading || streaming ? "Drafting letter…" : "Draft Referral Letter"}
              </button>
            </div>
          </div>
          <div className={styles.right}>
            <ResultPanel result={result} streaming={streaming} loading={loading}
              placeholderTitle="Referral letter will appear here"
              placeholderBody="Professional letter ready to print or send. Add patient name and physician signature before sending."
              resultLabel="Referral Letter"
              disclaimer="Add patient name, date of birth, and referring physician signature before sending. Review clinical details for accuracy."
              historyKey="referral-letter" />
              <SendPanel
                result={result}
                resultLabel="Referral Letter"
                workflowName="Referral Letter"
                practiceName=""
                isPatientFacing={false}
              />
          </div>
        </div>
      </div>
    </WorkflowLayout>
  );
}
