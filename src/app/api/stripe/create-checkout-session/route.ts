import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";
import { db } from "@/lib/db";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { priceId } = body;

    console.log('Received priceId:', priceId);

    if (!priceId) {
      return new NextResponse("Price ID is required", { status: 400 });
    }

    const user = await db.user.upsert({
      where: { email: session.user.email },
      create: { email: session.user.email },
      update: {},
    });

    // Create a customer in Stripe if they don't exist
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      console.log('Creating new Stripe customer for user:', user.email);
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      });
      customerId = customer.id;

      // Update user with Stripe customer ID
      await db.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    console.log('Creating checkout session for customer:', customerId);
    
    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?canceled=true`,
      metadata: {
        userId: user.id,
      },
    });

    console.log('Checkout session created:', checkoutSession.id);

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal server error",
      { status: 500 }
    );
  }
} 