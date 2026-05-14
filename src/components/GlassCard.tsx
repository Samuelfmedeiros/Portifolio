import { ReactNode } from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function GlassCard({ children, className = "", delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, boxShadow: "0 0 20px color-mix(in srgb, var(--accent) 15%, transparent), 0 0 40px color-mix(in srgb, var(--accent) 8%, transparent)" }}
      className={`glass rounded-xl p-5 md:p-6 border-[var(--border)] transition-shadow ${className}`}
    >
      {children}
    </motion.div>
  );
}
