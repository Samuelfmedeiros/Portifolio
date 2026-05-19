"use client";

import { useEffect, useState, useRef, useCallback } from "react";

function debounce<T extends (...args: any[]) => any>(fn: T, ms: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

import { memo } from "react";

export const ScrollProgress = memo(function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  const updateProgress = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    setProgress(scrollPercent);
  }, []);

  useEffect(() => {
    const debouncedScroll = debounce(updateProgress, 16); // ~60fps
    window.addEventListener("scroll", debouncedScroll, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", debouncedScroll);
  }, [updateProgress]);

  return (
    <div
      className="scroll-progress"
      style={{ width: `${progress}%` }}
      aria-hidden="true"
      role="presentation"
    />
  );
}
