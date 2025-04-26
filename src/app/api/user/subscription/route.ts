import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: { subscription: true },
    });

    if (!user?.subscription) {
      return new NextResponse("No subscription found", { status: 404 });
    }

    return NextResponse.json({
      id: user.subscription.id,
      status: user.subscription.status,
      plan: user.subscription.plan,
      currentPeriodStart: user.subscription.currentPeriodStart,
      currentPeriodEnd: user.subscription.currentPeriodEnd,
      stripeSubscriptionId: user.subscription.stripeSubscriptionId,
    });
  } catch (error) {
    console.error("[SUBSCRIPTION_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 
