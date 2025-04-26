"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Document, Page, pdf } from "@react-pdf/renderer";

export default function PreviewPolicy() {
  const { data: session } = useSession();
  const [isExporting, setIsExporting] = useState(false);

  // This would come from your API/state management
  const policyContent = `
    <h1>Privacy Policy</h1>
    <p>Last updated: ${new Date().toLocaleDateString()}</p>
    
    <h2>1. Introduction</h2>
    <p>This Privacy Policy describes how we collect, use, and handle your personal information when you use our website.</p>
    
    <h2>2. Information We Collect</h2>
    <p>We collect the following types of information:</p>
    <ul>
      <li>Personal Information (name, email, etc.)</li>
      <li>Usage Data</li>
      <li>Device Information</li>
    </ul>
    
    <h2>3. How We Use Your Information</h2>
    <p>We use the collected information to:</p>
    <ul>
      <li>Provide and maintain our service</li>
      <li>Notify you about changes to our service</li>
      <li>Provide customer support</li>
    </ul>
    
    <h2>4. Data Protection</h2>
    <p>We implement appropriate security measures to protect your personal information.</p>
    
    <h2>5. Your Rights</h2>
    <p>You have the right to:</p>
    <ul>
      <li>Access your personal data</li>
      <li>Request correction of your personal data</li>
      <li>Request deletion of your personal data</li>
    </ul>
    
    <h2>6. Contact Us</h2>
    <p>If you have any questions about this Privacy Policy, please contact us at example@email.com</p>
  `;

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // Create PDF document
      const doc = (
        <Document>
          <Page>
            <div dangerouslySetInnerHTML={{ __html: policyContent }} />
          </Page>
        </Document>
      );

      // Generate PDF blob
      const blob = await pdf(doc).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "privacy-policy.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportHTML = () => {
    const blob = new Blob([policyContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "privacy-policy.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Preview Your Privacy Policy
          </h1>
          <div className="flex space-x-4">
            {session ? (
              <>
                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isExporting ? "Exporting..." : "Export PDF"}
                </button>
                <button
                  onClick={handleExportHTML}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Export HTML
                </button>
              </>
            ) : (
              <Link
                href="/register"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign up to Export
              </Link>
            )}
          </div>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: policyContent }}
            />
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                This is a preview of your privacy policy. Please review it
                carefully and consult with a legal professional to ensure it meets
                your specific needs and complies with applicable laws.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 