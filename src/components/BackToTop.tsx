"use client";

import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

import { useAnalytics } from "@/hooks/useAnalytics";
import { useLanguage } from "@/lib/i18n";

export const BackToTop = memo(function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { track } = useAnalytics();
  const { t } = useLanguage();

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setVisible(window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    track({ type: "back_to_top" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={handleClick}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-[var(--accent)]/20 backdrop-blur-md border border-[var(--accent)]/40 text-[var(--accent)] hover:bg-[var(--accent)]/30 transition-colors shadow-lg"
          aria-label={t("aria.scroll.top")}
          title={t("aria.scroll.top")}
        >
          <ArrowUp className="w-5 h-5" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
});
