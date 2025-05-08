"use client";

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Help Center</h1>
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>How do I generate a privacy policy?</li>
          <li>How can I export my policy?</li>
          <li>Who can I contact for support?</li>
        </ul>
        <p className="mt-6 text-gray-600">For further assistance, please use our contact page.</p>
      </div>
    </div>
  );
} 