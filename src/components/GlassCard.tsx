import { forwardRef, ReactNode } from "react";
import { motion } from "framer-motion";
import { useMounted } from "@/hooks/useMounted";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  role?: string;
  "aria-labelledby"?: string;
  "aria-expanded"?: boolean;
  tabIndex?: number;
  onClick?: (e: React.MouseEvent) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className = "", delay = 0, ...rest }, ref) => {
    // SSR-safe: nasce visível no servidor; fade-in só no cliente (família #418/#50/#142)
    const mounted = useMounted();
    return (
      <motion.div
        ref={ref}
        initial={mounted ? { opacity: 0, y: 20 } : false}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.02, boxShadow: "0 0 20px color-mix(in srgb, var(--accent) 15%, transparent), 0 0 40px color-mix(in srgb, var(--accent) 8%, transparent)" }}
        className={`glass rounded-xl p-5 md:p-6 border-[var(--border)] transition-shadow ${className}`}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";
