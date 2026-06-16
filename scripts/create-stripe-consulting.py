#!/usr/bin/env python3
"""
Create a Stripe Payment Link for Consulting services.
Requires STRIPE_SECRET_KEY env var.

Usage:
    export STRIPE_SECRET_KEY=sk_live_...
    python3 scripts/create-stripe-consulting.py

Creates:
    1. Product "Consultoria Técnica"
    2. Price R$ 150/hora (one-time)
    3. Payment Link

Outputs the Payment Link URL to add to .env.local
"""

import os
import sys
import stripe

STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY", "").strip()
if not STRIPE_SECRET_KEY:
    print("❌ STRIPE_SECRET_KEY env var not set")
    print("Usage: STRIPE_SECRET_KEY=sk_live_... python3 scripts/create-stripe-consulting.py")
    sys.exit(1)

stripe.api_key = STRIPE_SECRET_KEY


def find_or_create_product(name: str, description: str) -> str:
    existing = stripe.Product.list(active=True, limit=100)
    for prod in existing.data:
        if prod.name == name:
            print(f"  → Found existing product: {prod.name} ({prod.id})")
            return prod.id

    product = stripe.Product.create(
        name=name,
        description=description,
        metadata={"app": "portifolio"},
    )
    print(f"  ✓ Created product: {product.name} ({product.id})")
    return product.id


def find_or_create_price(product_id: str, unit_amount_cents: int, currency: str, nickname: str) -> str:
    existing = stripe.Price.list(product=product_id, active=True, limit=100)
    for price in existing.data:
        if price.unit_amount == unit_amount_cents and price.currency == currency:
            print(f"  → Found existing price: {nickname} ({price.id})")
            return price.id

    new_price = stripe.Price.create(
        product=product_id,
        unit_amount=unit_amount_cents,
        currency=currency,
        nickname=nickname,
    )
    print(f"  ✓ Created price: {nickname} (R$ {unit_amount_cents/100:.2f}) — {new_price.id}")
    return new_price.id


def find_or_create_payment_link(price_id: str) -> str:
    existing = stripe.PaymentLink.list(active=True, limit=100)
    for link in existing.data:
        for item in link.line_items.data or []:
            if item.price.id == price_id:
                print(f"  → Found existing Payment Link: {link.url}")
                return link.url

    payment_link = stripe.PaymentLink.create(
        line_items=[{"price": price_id, "quantity": 1}],
        metadata={"app": "portifolio", "type": "consulting"},
    )
    print(f"  ✓ Created Payment Link: {payment_link.url}")
    return payment_link.url


def main():
    mode = "LIVE" if stripe.api_key.startswith("sk_live_") else "TEST"
    print(f"\n🚀 Creating Stripe Payment Link for Portifolio ({mode})\n")

    # Product
    prod_id = find_or_create_product(
        name="Consultoria Técnica",
        description=(
            "Desenvolvimento web · Consultoria técnica · "
            "Auditoria de código · Stack: Next.js, React, Python, FastAPI, SQL, DevOps"
        ),
    )

    # Prices — R$ 150/hora e pacotes
    price_hourly = find_or_create_price(
        product_id=prod_id,
        unit_amount_cents=15000,  # R$ 150,00
        currency="brl",
        nickname="Consultoria (hora)",
    )

    price_basic = find_or_create_price(
        product_id=prod_id,
        unit_amount_cents=200000,  # R$ 2.000,00 (~13h)
        currency="brl",
        nickname="Consultoria (pacote básico 13h)",
    )

    price_pro = find_or_create_price(
        product_id=prod_id,
        unit_amount_cents=500000,  # R$ 5.000,00 (~33h)
        currency="brl",
        nickname="Consultoria (pacote premium 33h)",
    )

    # Payment Link (use hourly price)
    payment_url = find_or_create_payment_link(price_hourly)

    print("\n" + "=" * 60)
    print("✅ DONE — Configure these in .env.local:\n")
    print(f"NEXT_PUBLIC_STRIPE_CONSULTING_LINK={payment_url}")
    print(f"\nPrices created:")
    print(f"  Hourly:     {price_hourly}")
    print(f"  Basic pkg:  {price_basic}")
    print(f"  Pro pkg:    {price_pro}")
    print("\nYou can create additional Payment Links for the packages in the Stripe Dashboard:")
    print("  https://dashboard.stripe.com/payment-links/create")
    print("=" * 60)


if __name__ == "__main__":
    main()
