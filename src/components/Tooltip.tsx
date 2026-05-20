"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

import { memo } from "react";

export const Tooltip = memo(function Tooltip({ children, content, className = "" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">("top");
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkPosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;
      setPosition(spaceAbove > 150 || spaceAbove > spaceBelow ? "top" : "bottom");
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      checkPosition();
      setIsVisible(true);
    }, 200);
  }, [checkPosition]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      checkPosition();
      setIsVisible((prev) => !prev);
    },
    [checkPosition]
  );

  const handleTouchOutside = useCallback(() => {
    setIsVisible(false);
  }, []);

  return (
    <>
      {/* Touch outside handler for mobile */}
      {isVisible && (
        <div
          className="fixed inset-0 z-40"
          onTouchStart={handleTouchOutside}
          onClick={handleTouchOutside}
          aria-hidden="true"
        />
      )}

      <div
        ref={triggerRef}
        className={`relative inline-flex ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
      >
        {children}

        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: position === "top" ? 4 : -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: position === "top" ? 4 : -4 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={`absolute left-1/2 -translate-x-1/2 z-50 pointer-events-none ${
                position === "top" ? "bottom-full mb-2" : "top-full mt-2"
              }`}
            >
              <div className="bg-[var(--bg-secondary)]/90 backdrop-blur-md border border-[var(--border)] rounded-lg px-3 py-2 shadow-lg min-w-[140px] max-w-[200px]">
                {content}
              </div>
              {/* Arrow */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--bg-secondary)]/90 backdrop-blur-md border-l border-b border-[var(--border)] rotate-45 ${
                  position === "top" ? "-bottom-1" : "-top-1"
                }`}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
});
