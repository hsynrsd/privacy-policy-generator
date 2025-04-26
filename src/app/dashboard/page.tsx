import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

// Define a type for policies in the dashboard
interface DashboardPolicy {
  id: string;
  title: string;
  type: string;
  jurisdiction: string;
  updatedAt: Date;
}

export default async function Dashboard() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      redirect('/login');
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { 
        policies: true, 
        subscription: true 
      },
    });

    if (!user) {
      redirect('/login');
    }

    const plan = user.subscription?.plan ?? 'free';

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <Link
              href="/generate"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              + New Policy
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700">Plan</h2>
            <p className="mt-1 text-sm text-gray-600">
              You are on the <span className="font-medium capitalize">{plan}</span> plan.
              {plan === 'free' && (
                <Link href="/pricing" className="ml-2 text-blue-600 hover:underline">
                  Upgrade
                </Link>
              )}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Your Policies</h2>
            {user.policies.length > 0 ? (
              <div className="bg-white shadow sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jurisdiction</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {user.policies.map((policy: DashboardPolicy) => (
                      <tr key={policy.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{policy.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policy.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policy.jurisdiction}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(policy.updatedAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href={`/policies/${policy.id}`} className="text-blue-600 hover:underline">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-600">You have not created any policies yet.</p>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Dashboard error:', error);
    redirect('/login');
  }
} 