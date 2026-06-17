"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Copy, Check, X, Heart, Coffee } from "lucide-react";
import { useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { BMC_CONFIG } from "@/lib/monetization";

const PIX_KEY = "samuelandrademedeiros@gmail.com";
const PIX_NAME = "Samuel Andrade Fonseca de Medeiros";
const PIX_CITY = "Brasilia";

/**
 * Botão "Apoiar" — modal com Pix + Buy Me a Coffee
 */
export function SupportButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { track } = useAnalytics();

  const handleOpen = () => {
    setOpen(true);
    track({ type: "external_link", url: "support-modal", label: "Apoiar" });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PIX_KEY);
    } catch {
      const el = document.createElement("textarea");
      el.value = PIX_KEY;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pixPayload = generatePixPayload(PIX_KEY, PIX_NAME, PIX_CITY);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(pixPayload)}`;

  return (
    <>
      {/* Botão Apoiar */}
      <motion.button
        onClick={handleOpen}
        className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl font-sans font-semibold
          bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent)]/5
          border border-[var(--accent)]/40 hover:border-[var(--accent)]/70
          text-[var(--accent)] hover:text-white
          shadow-lg shadow-[var(--accent)]/10 hover:shadow-[var(--accent)]/25
          transition-all duration-300 overflow-hidden"
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.97 }}
      >
        <span className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <Heart className="w-4 h-4 relative z-10" />
        <span className="relative z-10">Apoiar</span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm rounded-xl border border-[var(--accent)]/30 bg-[#0a0a0f] p-5 shadow-2xl shadow-[var(--accent)]/10"
            >
              {/* Fechar */}
              <button
                onClick={() => { setOpen(false); setCopied(false); }}
                className="absolute top-3 right-3 p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)] transition-colors"
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div className="text-center mb-5">
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <h2 className="text-base font-semibold text-[var(--text-primary)] font-mono">
                  Apoie este projeto
                </h2>
                <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                  Sua contribuição mantém o portfólio e os projetos open-source ativos 🚀
                </p>
              </div>

              {/* Opções */}
              <div className="space-y-3">
                {/* Pix */}
                <div className="flex flex-col items-center gap-3 p-4 rounded-xl border border-[var(--border)]/60">
                  {/* QR Code */}
                  <div className="w-[120px] h-[120px] rounded-xl overflow-hidden border border-[var(--border)]/60 bg-white p-1.5">
                    <img src={qrUrl} alt="Pix QR Code" className="w-full h-full object-contain" loading="lazy" />
                  </div>

                  {/* Chave */}
                  <div className="w-full">
                    <p className="text-[9px] font-mono text-[var(--text-secondary)] mb-1 text-center uppercase tracking-wider">
                      Chave Pix (email)
                    </p>
                    <div className="flex items-center gap-1.5">
                      <code className="flex-1 text-[11px] font-mono text-[var(--accent)] truncate bg-[var(--bg-primary)]/80 px-2.5 py-1.5 rounded-lg border border-[var(--border)]/40">
                        {PIX_KEY}
                      </code>
                      <button
                        onClick={handleCopy}
                        className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border border-[var(--border)]/60 hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/5 transition-all"
                        aria-label="Copiar chave"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[var(--text-secondary)]" />}
                      </button>
                    </div>
                  </div>

                  <p className="text-[9px] text-[var(--text-secondary)] text-center">
                    Escaneie o QR Code ou copie a chave e pague pelo app do seu banco 💙
                  </p>
                </div>

                {/* Buy Me a Coffee */}
                {BMC_CONFIG.enabled && (
                  <a
                    href={BMC_CONFIG.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)]/60 hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/5 transition-all cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0">
                      <Coffee className="w-4 h-5 text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--text-primary)]">Buy Me a Coffee</p>
                      <p className="text-[9px] text-[var(--text-secondary)]">Contribuição única — internacional</p>
                    </div>
                    <svg className="w-3.5 h-3.5 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                )}

                <p className="text-[9px] text-center text-[var(--text-secondary)]/50 pt-1">
                  Pagamento 100% seguro • Você escolhe o valor
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Gera payload Pix BR Code estático (formato EMV 2022) */
function generatePixPayload(key: string, name: string, city: string): string {
  const gui = "BR.GOV.BCB.PIX";
  const keyField = `01${String.fromCharCode(key.length)}${key}`;
  const mai = `0014${gui}${keyField}`;
  const maiLen = String.fromCharCode(mai.length);
  const trimmedName = name.slice(0, 25);
  const nameField = `59${String.fromCharCode(trimmedName.length)}${trimmedName}`;
  const trimmedCity = city.slice(0, 15);
  const cityField = `60${String.fromCharCode(trimmedCity.length)}${trimmedCity}`;
  const payload = `00020126${maiLen}${mai}5204000053039865802BR${nameField}${cityField}6304`;
  const crc = crc16(payload);
  return payload.slice(0, -4) + crc;
}

function crc16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) crc = (crc << 1) ^ 0x1021;
      else crc <<= 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}
