import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { getStripe } from "@/lib/stripe";

const PREFIX = process.env.NEXT_PUBLIC_TABLE_PREFIX || "";
const PROFILES_TABLE = `${PREFIX}profiles`;

// Disable body parsing so we can verify the raw payload signature.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

async function upsertProfileFromCheckout(
  session: Stripe.Checkout.Session
): Promise<void> {
  const supabase = adminClient();
  if (!supabase) return;
  const userId = session.client_reference_id || session.metadata?.userId;
  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;
  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;
  if (!userId) return;

  await supabase
    .from(PROFILES_TABLE)
    .update({
      stripe_customer_id: customerId ?? null,
      stripe_subscription_id: subscriptionId ?? null,
      stripe_status: "active",
    })
    .eq("id", userId);
}

async function upsertProfileFromSubscription(
  sub: Stripe.Subscription
): Promise<void> {
  const supabase = adminClient();
  if (!supabase) return;
  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const priceId = sub.items.data[0]?.price?.id ?? null;

  await supabase
    .from(PROFILES_TABLE)
    .update({
      stripe_subscription_id: sub.id,
      stripe_price_id: priceId,
      stripe_status: sub.status,
    })
    .eq("stripe_customer_id", customerId);
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json(
      { error: "missing signature or webhook secret" },
      { status: 401 }
    );
  }

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    return NextResponse.json(
      { error: "signature verification failed", detail: String(err) },
      { status: 401 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await upsertProfileFromCheckout(
          event.data.object as Stripe.Checkout.Session
        );
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await upsertProfileFromSubscription(
          event.data.object as Stripe.Subscription
        );
        break;
      default:
        // Unhandled event types are acknowledged so Stripe stops retrying.
        break;
    }
  } catch (err) {
    return NextResponse.json(
      { error: "handler failed", detail: String(err) },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
