"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Wallet } from "lucide-react";
import { useState } from "react";

const PIX_KEY = "samuelandrademedeiros@gmail.com";
const PIX_NAME = "Samuel Andrade Fonseca de Medeiros";
const PIX_CITY = "Brasilia";

/**
 * Componente de doação via Pix.
 * Exibe chave com botão copiar e QR Code.
 */
export function PixDonate({ className = "" }: { className?: string }) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PIX_KEY);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = PIX_KEY;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Gera payload Pix BR Code estático (sem valor fixo)
  const pixPayload = generatePixPayload(PIX_KEY, PIX_NAME, PIX_CITY);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixPayload)}`;

  return (
    <div className={className}>
      <motion.button
        onClick={() => setShowDetails(!showDetails)}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-sans text-sm
          border border-[var(--border)]/60
          bg-gradient-to-r from-[var(--bg-primary)]/80 to-[var(--bg-secondary)]/80
          hover:from-cyan-500/10 hover:to-cyan-600/5
          text-[var(--text-primary)] hover:text-[var(--accent)]
          shadow-sm hover:shadow-cyan-500/10
          transition-all duration-300 group`}
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.97 }}
      >
        <Wallet className="w-5 h-5 text-[var(--accent)]/70 group-hover:text-[var(--accent)] transition-colors" />
        <span className="font-medium">Pix</span>
        <span className="text-[var(--text-muted)] text-xs hidden sm:inline">
          — Ajude via Pix
        </span>
        <svg
          className={`w-3 h-3 text-[var(--text-muted)] transition-transform duration-300 ${
            showDetails ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-4 rounded-xl border border-[var(--border)]/60 bg-[var(--bg-primary)]/50">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* QR Code */}
                <div className="shrink-0 w-[100px] h-[100px] rounded-lg overflow-hidden border border-[var(--border)]">
                  <img
                    src={qrUrl}
                    alt="Pix QR Code"
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Key + copy */}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-mono text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                    Chave Pix (email)
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="block text-sm font-mono text-[var(--accent)] truncate bg-[var(--bg-primary)]/80 px-3 py-2 rounded-lg border border-[var(--border)]/40">
                      {PIX_KEY}
                    </code>
                    <button
                      onClick={handleCopy}
                      className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center border border-[var(--border)]/60 hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/5 transition-all"
                      aria-label={copied ? "Copiado!" : "Copiar chave Pix"}
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-[var(--text-secondary)]" />
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-[var(--text-secondary)] mt-2">
                    Escaneie o QR Code ou copie a chave para fazer um Pix 💙
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Gera payload Pix BR Code estático (formato EMV 2022)
 * Sem valor fixo — o usuário define no app do banco.
 * Campos de tamanho usam dígitos decimais com padding zero,
 * NÃO String.fromCharCode — codepoints de controle quebram o payload.
 */
function generatePixPayload(
  key: string,
  name: string,
  city: string
): string {
  // Merchant Account Information — Pix
  const gui = "BR.GOV.BCB.PIX";
  const keyLen = String(key.length).padStart(2, "0");
  const keyField = `01${keyLen}${key}`;
  const mai = `0014${gui}${keyField}`;
  const maiLen = String(mai.length).padStart(2, "0");

  // Merchant Category Code — 0000 (general)
  const mcc = "0000";

  // Transaction Currency — 986 (BRL)
  const currency = "986";

  // Country Code — BR
  const country = "BR";

  // Merchant Name — max 25 chars
  const trimmedName = name.slice(0, 25);
  const nameLen = String(trimmedName.length).padStart(2, "0");
  const nameField = `59${nameLen}${trimmedName}`;

  // Merchant City — max 15 chars
  const trimmedCity = city.slice(0, 15);
  const cityLen = String(trimmedCity.length).padStart(2, "0");
  const cityField = `60${cityLen}${trimmedCity}`;

  // CRC (placeholder, will be calculated)
  const crcPlaceholder = "6304";

  const payload = `00020126${maiLen}${mai}5204${mcc}5303${currency}5802${country}${nameField}${cityField}${crcPlaceholder}`;

  // Calculate CRC16-CCITT (includes "6304" placeholder, which is kept in final output)
  const crc = crc16(payload);
  return payload + crc;
}

function crc16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}
