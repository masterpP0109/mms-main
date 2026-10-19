import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./services.module.css";

export const enquiryLink = (service: string, origin: string) =>
  `/contact?${new URLSearchParams({ service, origin }).toString()}#enquiry`;

export function EnquiryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className={styles.button}>{children}<ArrowRight aria-hidden="true" size={18} /></Link>;
}

export function ServiceProcess({ steps }: { steps: { title: string; text: string }[] }) {
  return <section className={styles.section} aria-labelledby="process-title">
    <div data-reveal><p className={styles.eyebrow}>From the first conversation</p><h2 id="process-title">How it comes together</h2></div>
    <ol data-stagger className={styles.process}>{steps.map((step, index) => <li key={step.title}>
      <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <h3>{step.title}</h3><p>{step.text}</p>
    </li>)}</ol>
  </section>;
}

export function ServiceFAQs({ items }: { items: { question: string; answer: string }[] }) {
  return <section className={`${styles.section} ${styles.faqLayout}`} aria-labelledby="faq-title">
    <div data-reveal><p className={styles.eyebrow}>A little clarity</p><h2 id="faq-title">Before you enquire</h2></div>
    <div className={styles.faqs}>{items.map(item => <details key={item.question}>
      <summary>{item.question}</summary><p>{item.answer}</p>
    </details>)}</div>
  </section>;
}

export function ServiceClosing({ title, text, href, label, relatedHref, relatedLabel }: {
  title: string; text: string; href: string; label: string; relatedHref: string; relatedLabel: string;
}) {
  return <section className={`${styles.section} ${styles.closing}`} aria-labelledby="closing-title">
    <div data-reveal><p className={styles.eyebrow}>Let&apos;s make a plan</p><h2 id="closing-title">{title}</h2><p>{text}</p>
      <div className={styles.actions}><EnquiryLink href={href}>{label}</EnquiryLink><Link className={styles.textLink} href={relatedHref}>{relatedLabel}<ArrowRight aria-hidden="true" size={16} /></Link></div>
    </div>
  </section>;
}
