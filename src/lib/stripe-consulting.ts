// === Portifolio Samuel — Stripe Consulting Configuration ===
// Stripe Payment Link for consulting services.
// Requires env var NEXT_PUBLIC_STRIPE_CONSULTING_LINK to be set.

/** Stripe Consulting configuration */
export const STRIPE_CONSULTING_CONFIG = {
  /** Payment Link URL. Set via NEXT_PUBLIC_STRIPE_CONSULTING_LINK */
  get paymentLink(): string {
    const value = process.env.NEXT_PUBLIC_STRIPE_CONSULTING_LINK;
    return value ?? "";
  },
  /** Whether Stripe Consulting is enabled */
  get enabled(): boolean {
    return !!this.paymentLink;
  },
};
