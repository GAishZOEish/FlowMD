"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./ResultPanel.module.css";

interface HistoryEntry {
  id: number;
  label: string;
  content: string;
  ts: string;
}

interface ResultPanelProps {
  result: string;
  streaming: boolean;
  loading: boolean;
  placeholderTitle: string;
  placeholderBody: string;
  resultLabel: string;
  disclaimer: string;
  historyKey: string; // unique per workflow
}

function parseResult(text: string) {
  const lines = text.split("\n");
  const elements: { type: "heading" | "text"; content: string }[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Skip horizontal rules
    if (/^[-*_]{2,}\s*$/.test(trimmed)) continue;
    if (!trimmed) {
      elements.push({ type: "text", content: "" });
      continue;
    }
    // Strip **bold** markers and * bullet markers
    const cleaned = trimmed
      .replace(/\*\*([^*]+)\*\*/g, "$1")  // **bold** → bold
      .replace(/^[\*\-]\s+/, "")           // * item or - item → item
      .replace(/^#+\s*/, "");              // ## heading → heading
    // Detect section headers: all caps, optionally ending in colon
    const isHeading = /^[A-Z][A-Z\s\/\(\)&]{4,60}:?\s*$/.test(cleaned);
    elements.push({ type: isHeading ? "heading" : "text", content: cleaned });
  }
  return elements;
}

export default function ResultPanel({
  result, streaming, loading,
  placeholderTitle, placeholderBody,
  resultLabel, disclaimer, historyKey
}: ResultPanelProps) {
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<number | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Auto-scroll result panel as streaming comes in
  useEffect(() => {
    if (streaming && resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [result, streaming]);

  // Save to history when streaming ends and we have content
  useEffect(() => {
    if (!streaming && result && result.length > 20) {
      const now = new Date();
      const ts = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const label = result.split("\n").find(l => l.trim().length > 0)?.slice(0, 40) || resultLabel;
      const entry: HistoryEntry = { id: Date.now(), label, content: result, ts };
      setHistory(prev => [entry, ...prev].slice(0, 5));
      setActiveHistoryId(null);
    }
  }, [streaming, result]);

  const displayContent = activeHistoryId !== null
    ? history.find(h => h.id === activeHistoryId)?.content || result
    : result;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const parsed = displayContent ? parseResult(displayContent) : [];

  return (
    <div className={styles.panel}>
      {/* History strip */}
      {history.length > 0 && (
        <div className={styles.history}>
          <span className={styles.historyLabel}>Recent</span>
          {history.map(h => (
            <button
              key={h.id}
              className={`${styles.historyItem} ${activeHistoryId === h.id ? styles.historyItemActive : ""}`}
              onClick={() => setActiveHistoryId(activeHistoryId === h.id ? null : h.id)}
            >
              <span className={styles.historyTs}>{h.ts}</span>
              <span className={styles.historyText}>{h.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main output */}
      {!displayContent && !loading && (
        <div className={styles.placeholder}>
          <div className={styles.placeholderIcon}>◈</div>
          <p className={styles.placeholderTitle}>{placeholderTitle}</p>
          <p className={styles.placeholderBody}>{placeholderBody}</p>
        </div>
      )}

      {loading && !displayContent && (
        <div className={styles.placeholder}>
          <div className={styles.spinner} />
          <p>Generating…</p>
        </div>
      )}

      {displayContent && (
        <div className={styles.result}>
          <div className={styles.resultHeader}>
            <span className={styles.resultLabel}>
              {activeHistoryId !== null ? "Saved Result" : resultLabel}
              {streaming && <span className={styles.streamingDot} />}
            </span>
            <button className={`${styles.copyBtn} ${copied ? styles.copyBtnSuccess : ""}`} onClick={handleCopy}>
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>

          <div className={styles.resultBody} ref={resultRef}>
            {parsed.map((el, i) => {
              if (el.type === "heading") {
                return <div key={i} className={styles.sectionHeading}>{el.content.replace(/:$/, "")}</div>;
              }
              if (!el.content) {
                return <div key={i} className={styles.spacer} />;
              }
              return <p key={i} className={styles.para}>{el.content}</p>;
            })}
          </div>

          <div className={styles.resultDisclaimer}>{disclaimer}</div>
        </div>
      )}
    </div>
  );
}
