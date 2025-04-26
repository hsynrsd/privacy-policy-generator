"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function BillingPage() {
  const { data: session } = useSession();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch("/api/user/subscription");
        if (response.status === 404) {
          // No subscription found, user is on free plan
          setSubscription(null);
          return;
        }
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to fetch subscription");
        }
        const data = await response.json();
        setSubscription(data);
      } catch (error) {
        console.error("Error fetching subscription:", error);
        toast.error("Failed to load subscription details");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      console.log('Price ID:', process.env.NEXT_PUBLIC_STRIPE_PRICE_ID);
      
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server response:', errorData);
        throw new Error(`Failed to create checkout session: ${errorData}`);
      }

      const { sessionId } = await response.json();
      console.log('Session ID:', sessionId);
      
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to initialize");

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) throw error;
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to start checkout process");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/stripe/cancel-subscription", {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to cancel subscription");

      toast.success("Subscription cancelled successfully");
      setSubscription(null);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to cancel subscription");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="max-w-2xl mx-auto p-6">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Billing & Subscription</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
        
        {subscription ? (
          <div className="space-y-4">
            <p className="text-gray-600">
              Status: <span className="font-medium">{subscription.status}</span>
            </p>
            <p className="text-gray-600">
              Plan: <span className="font-medium">{subscription.plan}</span>
            </p>
            <p className="text-gray-600">
              Next Billing Date:{" "}
              <span className="font-medium">
                {new Date(subscription.currentPeriod).toLocaleDateString()}
              </span>
            </p>
            
            <button
              onClick={handleCancel}
              disabled={loading}
              className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Cancel Subscription
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">You are currently on the free plan.</p>
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Upgrade to Premium
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 