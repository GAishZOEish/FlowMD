"use client";

import { useState } from "react";
import WorkflowLayout from "../components/WorkflowLayout";
import ResultPanel from "../components/ResultPanel";
import SendPanel from "../components/SendPanel";
import styles from "../workflow.module.css";

interface ServiceLine {
  code: string;
  description: string;
  quantity: string;
  rate: string;
}

export default function GoodFaithEstimatePage() {
  const [practiceName, setPracticeName] = useState("");
  const [providerName, setProviderName] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [serviceLines, setServiceLines] = useState<ServiceLine[]>([{ code: "", description: "", quantity: "1", rate: "" }]);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [result, setResult] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addLine = () => setServiceLines(l => [...l, { code: "", description: "", quantity: "1", rate: "" }]);
  const removeLine = (i: number) => setServiceLines(l => l.filter((_, idx) => idx !== i));
  const updateLine = (i: number, field: keyof ServiceLine, val: string) =>
    setServiceLines(l => l.map((line, idx) => idx === i ? { ...line, [field]: val } : line));

  const handleSubmit = async () => {
    if (!serviceLines[0].description && !serviceLines[0].code) { setError("Add at least one service."); return; }
    setError(""); setLoading(true); setStreaming(true); setResult("");
    try {
      const res = await fetch("/api/good-faith-estimate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ practiceName, providerName, scheduledDate, serviceLines, additionalNotes }),
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
          <span className={styles.workflowLabel}>03 — Good Faith Estimate</span>
        </div>
        <div className={styles.workflowMain}>
          <div className={styles.left}>
            <h1 className={styles.title}>Good Faith<br />Estimate</h1>
            <p className={styles.subtitle}>Required under the No Surprises Act for uninsured and self-pay patients. Enter the scheduled services and generate a compliant cost estimate in minutes.</p>
            <div className={styles.form}>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Practice Name <span className={styles.optional}>(optional)</span></label>
                  <input className={styles.input} type="text" placeholder="Riverside Cardiology" value={practiceName} onChange={e => setPracticeName(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Provider Name <span className={styles.optional}>(optional)</span></label>
                  <input className={styles.input} type="text" placeholder="Dr. Jane Smith" value={providerName} onChange={e => setProviderName(e.target.value)} />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Scheduled Date <span className={styles.optional}>(optional)</span></label>
                <input className={styles.input} type="text" placeholder="e.g. April 15, 2026" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Services<span className={styles.hint}>Add each service or procedure separately</span></label>
                {serviceLines.map((line, i) => (
                  <div key={i} className={styles.serviceLine}>
                    <div className={styles.serviceLineRow}>
                      <input className={styles.input} type="text" placeholder="CPT code (optional)" style={{ width: 120, flexShrink: 0 }}
                        value={line.code} onChange={e => updateLine(i, "code", e.target.value)} />
                      <input className={styles.input} type="text" placeholder="Service description"
                        value={line.description} onChange={e => updateLine(i, "description", e.target.value)} />
                      {serviceLines.length > 1 && (
                        <button className={styles.removeBtn} onClick={() => removeLine(i)}>✕</button>
                      )}
                    </div>
                    <div className={styles.serviceLineRow}>
                      <input className={styles.input} type="text" placeholder="Qty" style={{ width: 60, flexShrink: 0 }}
                        value={line.quantity} onChange={e => updateLine(i, "quantity", e.target.value)} />
                      <input className={styles.input} type="text" placeholder="Estimated cost (e.g. $250)"
                        value={line.rate} onChange={e => updateLine(i, "rate", e.target.value)} />
                    </div>
                  </div>
                ))}
                <button className={styles.addBtn} onClick={addLine}>+ Add service</button>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Additional Notes <span className={styles.optional}>(optional)</span></label>
                <textarea className={styles.textarea} rows={2} placeholder="e.g. Estimate valid for 90 days. Anesthesia billed separately."
                  value={additionalNotes} onChange={e => setAdditionalNotes(e.target.value)} />
              </div>
              {error && <div className={styles.error}>{error}</div>}
              <button className={styles.button} onClick={handleSubmit} disabled={loading || streaming}>
                {loading || streaming ? "Generating estimate…" : "Generate Good Faith Estimate"}
              </button>
            </div>
          </div>
          <div className={styles.right}>
            <ResultPanel result={result} streaming={streaming} loading={loading}
              placeholderTitle="Good faith estimate will appear here"
              placeholderBody="Compliant cost estimate document ready to provide to uninsured or self-pay patients."
              resultLabel="Good Faith Estimate"
              disclaimer="Review with qualified billing staff before delivery. This estimate must be provided at least 3 business days before a scheduled service under the No Surprises Act."
              historyKey="good-faith-estimate" />
              <SendPanel
                result={result}
                resultLabel="Good Faith Estimate"
                workflowName="Good Faith Estimate"
                practiceName=""
                isPatientFacing={true}
              />
          </div>
        </div>
      </div>
    </WorkflowLayout>
  );
}
