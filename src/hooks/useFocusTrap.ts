"use client";

import { useEffect, useRef } from "react";

/** Focusable elements selector */
const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Trap focus inside a container when active.
 * - Saves the trigger element on activation
 * - Focuses the first focusable element inside the container
 * - Cycles focus with Tab/Shift+Tab inside the container
 * - Calls onClose on Escape
 * - Restores focus to the trigger on deactivation/unmount
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  active: boolean,
  onClose: () => void
) {
  const triggerRef = useRef<Element | null>(null);
  const onCloseRef = useRef(onClose);

  // Sync the latest onClose callback after each render (avoids stale closure
  // without accessing .current during render, which React 19 forbids)
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!active) return;

    // Save the currently focused element (trigger)
    triggerRef.current = document.activeElement;

    const container = containerRef.current;
    if (!container) return;

    // Focus first focusable element inside
    const firstFocusable = container.querySelector(FOCUSABLE) as HTMLElement | null;
    // Small delay to let the animation start
    const raf = requestAnimationFrame(() => {
      firstFocusable?.focus();
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }

      if (e.key !== "Tab") return;

      const focusables = container.querySelectorAll(FOCUSABLE);
      if (focusables.length === 0) return;

      const first = focusables[0] as HTMLElement;
      const last = focusables[focusables.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", handleKeyDown);
      // Restore focus to trigger
      if (triggerRef.current instanceof HTMLElement) {
        triggerRef.current.focus();
      }
    };
  }, [active, containerRef]); // onClose intentionally removed — stale closure avoided via ref
}
