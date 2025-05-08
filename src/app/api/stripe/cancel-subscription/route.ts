import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-03-31.basil",
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { subscription: true },
    });

    if (!user?.subscription) {
      return new NextResponse("No active subscription found", { status: 404 });
    }

    if (!user.subscription.stripeSubscriptionId) {
      return new NextResponse("No Stripe subscription ID found", { status: 404 });
    }

    // Cancel the subscription in Stripe
    await stripe.subscriptions.cancel(user.subscription.stripeSubscriptionId);

    // Update the subscription status in the database
    await prisma.subscription.update({
      where: { id: user.subscription.id },
      data: {
        status: "CANCELED",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[STRIPE_CANCEL]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 