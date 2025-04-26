import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Settings() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: { subscription: true },
  });

  if (!user) {
    redirect("/login");
  }

  const plan = user.subscription?.plan ?? "free";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

        <section className="bg-white shadow sm:rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Profile</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <p className="mt-1 text-gray-900">{user.name || '—'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-gray-900">{user.email}</p>
            </div>
          </div>
          <Link
            href="/settings/edit"
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            Edit Profile
          </Link>
        </section>

        <section className="bg-white shadow sm:rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Subscription</h2>
          <p className="text-sm text-gray-600 mb-2">
            Current Plan: <span className="font-medium capitalize">{plan}</span>
          </p>
          {plan === 'free' ? (
            <Link
              href="/pricing"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
            >
              Upgrade to Premium
            </Link>
          ) : (
            <p className="text-sm text-gray-600">Manage your subscription in the billing portal.</p>
          )}
        </section>
      </div>
    </div>
  );
} 