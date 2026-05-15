"use client";

import { motion } from "framer-motion";
import { useEffect, useState, ReactNode } from "react";

interface ResponsiveSectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  fullHeight?: boolean;
}

// Hook to detect mobile view
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);

  return isMobile;
}

export function ResponsiveSection({
  children,
  id,
  className = "",
  fullHeight = false,
}: ResponsiveSectionProps) {
  const isMobile = useIsMobile();

  return (
    <section
      id={id}
      className={`
        relative
        ${fullHeight ? "min-h-screen" : "py-12 md:py-16 lg:py-20"}
        px-4 sm:px-6 md:px-8 lg:px-12
        transition-all duration-300
        ${className}
      `}
    >
      {/* Mobile-first responsive container */}
      <div className="max-w-7xl mx-auto w-full">
        {/* Responsive spacing for children */}
        <div className="space-y-6 md:space-y-8 lg:space-y-10">
          {children}
        </div>
      </div>
    </section>
  );
}

// Animated heading with responsive sizes
interface AnimatedHeadingProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4";
  className?: string;
  accent?: string;
}

export function AnimatedHeading({
  children,
  as: Tag = "h2",
  className = "",
  accent,
}: AnimatedHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {accent && (
        <span className="block font-mono text-sm sm:text-base md:text-lg tracking-[0.2em] sm:tracking-[0.3em] text-[var(--accent)] mb-4 md:mb-6">
          {accent}
        </span>
      )}
      <Tag
        className={`
          font-bold tracking-tight
          text-xl sm:text-2xl md:text-3xl lg:text-4xl
          text-[var(--text-primary)]
        `}
      >
        {children}
      </Tag>
    </motion.div>
  );
}

// Responsive card wrapper
interface ResponsiveCardProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveCard({ children, className = "" }: ResponsiveCardProps) {
  return (
    <div
      className={`
        rounded-xl p-4 sm:p-5 md:p-6
        glass border border-[var(--border)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Responsive grid system
interface ResponsiveGridProps {
  children: ReactNode;
  cols?: {
    mobile: number;
    tablet?: number;
    desktop?: number;
    large?: number;
  };
  gap?: {
    mobile?: string;
    desktop?: string;
  };
  className?: string;
}

export function ResponsiveGrid({
  children,
  cols = { mobile: 1, tablet: 2, desktop: 3, large: 4 },
  gap = { mobile: "gap-4", desktop: "md:gap-6 lg:gap-8" },
  className = "",
}: ResponsiveGridProps) {
  const gridCols: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div
      className={`
        grid
        ${gridCols[cols.mobile] || gridCols[1]}
        ${gap.mobile || "gap-4"}
        ${gap.desktop || "md:gap-6 lg:gap-8"}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Responsive text utilities
export function ResponsiveText({
  children,
  size = "base",
  weight = "normal",
  color = "primary",
  className = "",
}: {
  children: ReactNode;
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold";
  color?: "primary" | "secondary" | "accent";
  className?: string;
}) {
  const sizes = {
    xs: "text-[10px] sm:text-xs",
    sm: "text-xs sm:text-sm",
    base: "text-sm sm:text-base",
    lg: "text-base sm:text-lg",
    xl: "text-lg sm:text-xl",
    "2xl": "text-xl sm:text-2xl",
  };

  const colors = {
    primary: "text-[var(--text-primary)]",
    secondary: "text-[var(--text-secondary)]",
    accent: "text-[var(--accent)]",
  };

  return (
    <span className={`${sizes[size]} ${colors[color]} ${className}`}>
      {children}
    </span>
  );
}

// Visible on scroll indicator
export function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
    >
      <div className="flex flex-col items-center gap-2 text-[var(--text-secondary)]">
        <span className="text-[10px] font-mono tracking-widest">SCROLL</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-5 h-8 border border-[var(--border)] rounded-full flex items-start justify-center p-1"
        >
          <div className="w-1 h-2 bg-[var(--accent)] rounded-full" />
        </motion.div>
      </div>
    </motion.div>
  );
}