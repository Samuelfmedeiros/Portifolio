"use client";

import dynamic from "next/dynamic";
import { LazySection } from "./LazySection";
import { useLanguage } from "@/lib/i18n";

//  Bloco perf 12/08/2026 — ContactForm importa supabase client (~16KB+ de
// deps): só carrega quando o usuário chega ao fim da página. ssr:false = fora
// do bundle inicial. Fallback altura medida (mobile 760 / desktop 737) → CLS 0.
const ContactForm = dynamic(
  () => import("./ContactForm").then((m) => m.ContactForm),
  {
    ssr: false,
    loading: () => <ContactFallback />,
  }
);

export function ContactFallback() {
  const { t } = useLanguage();
  return (
    <div
      className="flex items-center justify-center text-sm text-[var(--text-secondary)]"
      style={{ minHeight: "737px" }}
    >
      {t("contact.form.loading")}
    </div>
  );
}

export function LazyContactForm() {
  return (
    <LazySection fallback={<ContactFallback />}>
      <ContactForm />
    </LazySection>
  );
}
