"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./WorkflowLayout.module.css";

const WORKFLOWS = [
  { num: "01", label: "Pre-Treatment Estimator", href: "/pre-treatment", group: "patient" },
  { num: "02", label: "Post-Adjudication Letter", href: "/post-treatment", group: "patient" },
  { num: "03", label: "Good Faith Estimate", href: "/good-faith-estimate", group: "patient" },
  { num: "04", label: "Superbill Explainer", href: "/superbill-explainer", group: "patient" },
  { num: "05", label: "Discharge Billing Summary", href: "/discharge-billing-summary", group: "patient" },
  { num: "06", label: "Condition Explainer", href: "/condition-explainer", group: "patient" },
  { num: "07", label: "Referral Letter", href: "/referral-letter", group: "billing" },
  { num: "08", label: "Denial Reason Decoder", href: "/denial-decoder", group: "billing" },
  { num: "09", label: "Prior Auth Explainer", href: "/prior-auth-explainer", group: "billing" },
];

export default function WorkflowLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.shell}>
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.logoLink} onClick={() => setSidebarOpen(false)}>
            <span className={styles.logoText}>FlowMD</span>
          </Link>
          <button className={styles.closeBtn} onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navGroup}>
            <span className={styles.navGroupLabel}>Patient-Facing</span>
            {WORKFLOWS.filter(w => w.group === "patient").map(w => (
              <Link
                key={w.href}
                href={w.href}
                onClick={() => setSidebarOpen(false)}
                className={`${styles.navItem} ${pathname === w.href ? styles.navItemActive : ""}`}
              >
                <span className={styles.navNum}>{w.num}</span>
                <span className={styles.navLabel}>{w.label}</span>
              </Link>
            ))}
          </div>

          <div className={styles.navGroup}>
            <span className={styles.navGroupLabel}>Internal Billing</span>
            {WORKFLOWS.filter(w => w.group === "billing").map(w => (
              <Link
                key={w.href}
                href={w.href}
                onClick={() => setSidebarOpen(false)}
                className={`${styles.navItem} ${pathname === w.href ? styles.navItemActive : ""}`}
              >
                <span className={styles.navNum}>{w.num}</span>
                <span className={styles.navLabel}>{w.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.homeLink} onClick={() => setSidebarOpen(false)}>
            ← All tools
          </Link>
        </div>
      </aside>

      <div className={styles.content}>
        <div className={styles.topBar}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}>☰</button>
          <Link href="/" className={styles.topBarLogo}>FlowMD</Link>
          <Link href="/" className={styles.topBarBack}>← All tools</Link>
        </div>

        {children}
      </div>
    </div>
  );
}
