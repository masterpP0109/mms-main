"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown } from "lucide-react";
import styles from "./services.module.css";

export type DroneServiceItem = {
  title: string;
  detail: string;
};

export default function DroneServiceCards({ items }: { items: readonly DroneServiceItem[] }) {
  const [openTitle, setOpenTitle] = useState<string | null>(null);

  return (
    <ul data-stagger className={styles.serviceChecklist}>
      {items.map((item) => {
        const isOpen = openTitle === item.title;
        return (
          <li
            key={item.title}
            className={`${styles.serviceChecklistItem} ${isOpen ? styles.serviceCardOpen : ""}`}
          >
            <button
              type="button"
              className={styles.serviceCardTrigger}
              aria-expanded={isOpen}
              onClick={() => setOpenTitle((current) => (current === item.title ? null : item.title))}
            >
              <span className={styles.serviceCardHeader}>
                <CheckCircle2 size={18} className={styles.serviceChecklistIcon} aria-hidden="true" />
                <span className={styles.serviceCardTitle}>{item.title}</span>
              </span>
              <ChevronDown size={16} className={styles.serviceCardChevron} aria-hidden="true" />
            </button>
            <div className={styles.serviceCardDetailWrap}>
              <div className={styles.serviceCardDetailInner}>
                <p className={styles.serviceCardDetail}>{item.detail}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
