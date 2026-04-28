import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

// POST /api/checkout
// Body: { plan: string, email?: string, userId?: string }
// Looks up the configured price id for `plan` from env
// (NEXT_PUBLIC_STRIPE_<PLAN>_PRICE_ID) and creates a Checkout Session.
export async function POST(req: NextRequest) {
  let body: { plan?: string; email?: string; userId?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const planSlug = (body.plan || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "_");
  if (!planSlug) {
    return NextResponse.json({ error: "missing plan" }, { status: 400 });
  }

  const envKey = `NEXT_PUBLIC_STRIPE_${planSlug}_PRICE_ID`;
  const priceId = process.env[envKey];
  if (!priceId) {
    return NextResponse.json(
      { error: `no price configured for plan '${body.plan}'`, envKey },
      { status: 400 }
    );
  }

  const origin =
    req.nextUrl.origin ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: body.email,
      client_reference_id: body.userId,
      metadata: {
        plan: body.plan || "",
        userId: body.userId || "",
      },
      success_url: `${origin}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?checkout=cancelled`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err) {
    return NextResponse.json(
      { error: "stripe checkout failed", detail: String(err) },
      { status: 500 }
    );
  }
}
