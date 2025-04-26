import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

const mapStripeStatusToPrisma = (status: string) => {
  switch (status) {
    case "active":
      return "ACTIVE";
    case "canceled":
      return "CANCELED";
    case "past_due":
      return "PAST_DUE";
    case "trialing":
      return "TRIALING";
    default:
      return "ACTIVE";
  }
};

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get("Stripe-Signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) return;
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "customer.subscription.updated":
        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;
          const currentPeriod = new Date((subscription as any).current_period_end * 1000);

          const existingSubscription = await prisma.subscription.findFirst({
            where: {
              stripeSubscriptionId: subscription.id,
            },
          });

          if (existingSubscription) {
            await prisma.subscription.update({
              where: {
                id: existingSubscription.id,
              },
              data: {
                status: mapStripeStatusToPrisma(subscription.status),
                currentPeriodEnd: currentPeriod,
              },
            });
          }
          break;
        }
        case "checkout.session.completed": {
          const checkoutSession = event.data.object as Stripe.Checkout.Session;

          if (checkoutSession.mode === "subscription") {
            const subscriptionId = checkoutSession.subscription as string;
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const currentPeriod = new Date((subscription as any).current_period_end * 1000);

            await prisma.subscription.update({
              where: {
                userId: checkoutSession.client_reference_id!,
              },
              data: {
                stripeSubscriptionId: subscription.id,
                status: mapStripeStatusToPrisma(subscription.status),
                plan: "PREMIUM",
                currentPeriodEnd: currentPeriod,
              },
            });
          }
          break;
        }
        default:
          throw new Error("Unhandled relevant event!");
      }
    } catch (error) {
      console.log(error);
      return new NextResponse('Webhook error: "Webhook handler failed. View logs."', { status: 400 });
    }
  }

  return new NextResponse(null, { status: 200 });
} 