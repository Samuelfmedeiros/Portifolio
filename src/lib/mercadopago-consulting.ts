// === Portifolio Samuel — Mercado Pago Consulting Configuration ===
// Mercado Pago Checkout Pro link for consulting services.
// Requires env var NEXT_PUBLIC_MP_CONSULTING_LINK to be set.
// Used as an alternative to Stripe for Brazilian customers (Pix, Boleto, Cartão parcelado).

/** Mercado Pago Consulting configuration */
export const MP_CONSULTING_CONFIG = {
  /** Checkout Pro link URL. Set via NEXT_PUBLIC_MP_CONSULTING_LINK */
  get paymentLink(): string {
    const value = process.env.NEXT_PUBLIC_MP_CONSULTING_LINK;
    return value ?? "";
  },
  /** Whether Mercado Pago consulting is enabled */
  get enabled(): boolean {
    return !!this.paymentLink;
  },
};
