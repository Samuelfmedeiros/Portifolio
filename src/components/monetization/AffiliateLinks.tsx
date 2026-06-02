"use client";

import { ExternalLink } from "lucide-react";
import {
  getProjectAffiliates,
  getActiveAffiliates,
  type AffiliateLink,
} from "@/lib/monetization";

/**
 * Affiliate link badge — rendered inline next to project info.
 * Shows a small "Powered by X" or "Uses X" link.
 * These are NOT ads — they're genuine tool references with affiliate params.
 * No consent required (organic references, not behavioral tracking).
 */
export function AffiliateBadge({ affiliate }: { affiliate: AffiliateLink }) {
  if (!affiliate.active) return null;

  return (
    <a
      href={affiliate.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      aria-label={`${affiliate.name} — link de afiliado`}
      className="inline-flex items-center gap-0.5 text-[9px] font-mono
        text-[var(--text-secondary)]/60 hover:text-[var(--accent)]
        transition-colors duration-200"
    >
      <ExternalLink className="w-2.5 h-2.5" />
      <span>{affiliate.name}</span>
    </a>
  );
}

/**
 * Affiliate links for a specific project.
 * Shown as a row of small badges below the project card.
 */
export function ProjectAffiliates({
  projectName,
  className = "",
}: {
  projectName: string;
  className?: string;
}) {
  const affiliates = getProjectAffiliates(projectName);
  if (affiliates.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {affiliates.map((a) => (
        <AffiliateBadge key={a.key} affiliate={a} />
      ))}
    </div>
  );
}

/**
 * Full affiliate section — for footer or dedicated page.
 * Groups by category.
 */
export function AffiliateSection({ className = "" }: { className?: string }) {
  const hosting = getActiveAffiliates("hosting");
  const database = getActiveAffiliates("database");
  const tools = getActiveAffiliates("tools");
  const learning = getActiveAffiliates("learning");

  const categories = [
    { label: "Hospedagem", items: hosting },
    { label: "Banco de Dados", items: database },
    { label: "Ferramentas", items: tools },
    { label: "Aprendizado", items: learning },
  ].filter((c) => c.items.length > 0);

  if (categories.length === 0) return null;

  return (
    <div className={className}>
      <h3 className="font-mono text-xs text-[var(--accent)] mb-2">
        Ferramentas que uso
      </h3>
      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.label}>
            <p className="text-[10px] font-mono text-[var(--text-secondary)]/50 mb-1">
              {cat.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {cat.items.map((a) => (
                <AffiliateBadge key={a.key} affiliate={a} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-[9px] font-mono text-[var(--text-secondary)]/30 mt-2">
        * Links de afiliado — sem custo extra para você
      </p>
    </div>
  );
}
