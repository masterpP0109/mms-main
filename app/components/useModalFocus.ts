"use client";

import { useEffect, useRef, type RefObject } from "react";

/** Shared keyboard, background isolation and scroll lifecycle for overlays. */
export function useModalFocus(open: boolean, root: RefObject<HTMLElement | null>, onClose: () => void) {
  const close = useRef(onClose);
  useEffect(() => { close.current = onClose; }, [onClose]);

  useEffect(() => {
    const element = root.current;
    if (!open || !element) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    const isolated: Array<[HTMLElement, boolean]> = [];
    let branch: HTMLElement = element;
    while (branch.parentElement && branch !== document.body) {
      for (const sibling of branch.parentElement.children) {
        if (sibling instanceof HTMLElement && sibling !== branch) {
          isolated.push([sibling, sibling.inert]);
          sibling.setAttribute("inert", "");
        }
      }
      branch = branch.parentElement;
    }
    const focusable = () => Array.from(element.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]'
    )).filter(item => item.getClientRects().length && !item.closest('[inert]'));
    document.body.style.overflow = "hidden";
    focusable()[0]?.focus({ preventScroll: true });
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); close.current(); }
      if (event.key !== "Tab") return;
      const items = focusable();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && (document.activeElement === first || !element.contains(document.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !element.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("keydown", keydown);
      document.body.style.overflow = overflow;
      isolated.forEach(([item, inert]) => { if (!inert) item.removeAttribute("inert"); });
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [open, root]);
}
