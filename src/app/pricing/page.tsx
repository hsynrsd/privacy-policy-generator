"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

const features = {
  free: [
    "1 Privacy Policy",
    "Full Preview Access",
    "Basic HTML Export",
    "Essential Compliance",
    "Basic Customization",
    "Basic Support",
  ],
  premium: [
    "Unlimited Policies",
    "All Policy Types (Privacy, Terms, Cookies)",
    "Premium Exports (PDF, Word, HTML)",
    "Remove Branding",
    "Auto-Update Notifications",
    "Custom Branding",
    "Advanced Clauses",
    "Multiple Languages",
    "Priority Support",
    "Version History",
    "Team Collaboration",
  ]
};

export default function Pricing() {
  const { data: session } = useSession();

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the right plan for&nbsp;you
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Start with our free plan and upgrade when you need more features. All plans include regular updates to keep your documents compliant.
        </p>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Free Plan */}
          <div className="flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10">
            <div>
              <div className="flex items-center justify-between gap-x-4">
                <h3 className="text-lg font-semibold leading-8 text-gray-900">
                  Free
                </h3>
                <p className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold leading-5 text-gray-600">
                  Get Started
                </p>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                Perfect for small businesses needing a basic privacy policy.
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">$0</span>
                <span className="text-sm font-semibold leading-6 text-gray-600">/forever</span>
              </p>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                {features.free.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <svg className="h-6 w-5 flex-none text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/generate"
              className="mt-8 block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Get started
            </Link>
          </div>

          {/* Premium Plan */}
          <div className="flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-blue-900/10 xl:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 -z-10 w-full h-full bg-gradient-to-b from-blue-50 via-white to-white"></div>
            <div>
              <div className="flex items-center justify-between gap-x-4">
                <h3 className="text-lg font-semibold leading-8 text-gray-900">
                  Premium
                </h3>
                <p className="rounded-full bg-blue-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-blue-600">
                  Most popular
                </p>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                Perfect for businesses that need comprehensive legal coverage.
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">$5</span>
                <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
              </p>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                {features.premium.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <svg className="h-6 w-5 flex-none text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href={session ? "/settings/billing" : "/register"}
              className="mt-8 block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              {session ? "Upgrade now" : "Get started"}
            </Link>
          </div>
        </div>


        {/* FAQ Section */}
        <div className="mt-24">
          <h3 className="text-lg font-semibold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h3>
          <dl className="space-y-8 divide-y divide-gray-900/10">
            <div className="pt-8 lg:grid lg:grid-cols-12 lg:gap-8">
              <dt className="text-base font-semibold leading-7 text-gray-900 lg:col-span-5">
                Can I use the free plan forever?
              </dt>
              <dd className="mt-4 lg:col-span-7 lg:mt-0">
                <p className="text-base leading-7 text-gray-600">
                  Yes! Our free plan is not a trial - it's a fully functional plan that you can use indefinitely. Upgrade only when you need premium features.
                </p>
              </dd>
            </div>
            <div className="pt-8 lg:grid lg:grid-cols-12 lg:gap-8">
              <dt className="text-base font-semibold leading-7 text-gray-900 lg:col-span-5">
                What's included in auto-updates?
              </dt>
              <dd className="mt-4 lg:col-span-7 lg:mt-0">
                <p className="text-base leading-7 text-gray-600">
                  Premium users receive notifications when privacy laws change, with suggestions for policy updates to maintain compliance.
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
} 