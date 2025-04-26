"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  jurisdiction: z.string().min(1, "Jurisdiction is required"),
  websiteUrl: z.string().url("Please enter a valid URL"),
  contactEmail: z.string().email("Please enter a valid email"),
  dataTypes: z.array(z.string()).min(1, "Select at least one data type"),
  thirdPartyServices: z.array(z.string()),
  cookieUsage: z.boolean(),
  gdprCompliant: z.boolean(),
  targetAudience: z.array(z.string()).min(1, "Select at least one target audience"),
});

type FormData = z.infer<typeof formSchema>;

const dataTypes = [
  "Personal Information",
  "Contact Information",
  "Payment Information",
  "Usage Data",
  "Location Data",
  "Device Information",
  "Cookies",
  "Other",
];

const thirdPartyServices = [
  "Google Analytics",
  "Stripe",
  "PayPal",
  "Mailchimp",
  "HubSpot",
  "Facebook Pixel",
  "Other",
];

const jurisdictions = [
  "EU",
  "US",
  "UK",
  "Canada",
  "Australia",
  "Japan",
  "Other",
];

const targetAudiences = [
  "EU Citizens",
  "US Citizens",
  "Children",
  "Businesses",
  "General Public",
];

export default function GeneratePolicy() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataTypes: [],
      thirdPartyServices: [],
      cookieUsage: false,
      gdprCompliant: false,
      targetAudience: [],
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsGenerating(true);
    try {
      // Here we would make an API call to generate the policy
      // For now, we'll just redirect to a preview page
      router.push("/preview");
    } catch (error) {
      console.error("Error generating policy:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Generate Your Privacy Policy
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Fill out the form below to generate a compliant privacy policy for your
            business.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-12 space-y-8">
          {/* Business Information */}
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Business Information
            </h2>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="businessName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Business Name
                </label>
                <input
                  type="text"
                  id="businessName"
                  {...register("businessName")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-black"
                />
                {errors.businessName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.businessName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="businessType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Business Type
                </label>
                <input
                  type="text"
                  id="businessType"
                  {...register("businessType")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-black"
                />
                {errors.businessType && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.businessType.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="websiteUrl"
                  className="block text-sm font-medium text-gray-700"
                >
                  Website URL
                </label>
                <input
                  type="url"
                  id="websiteUrl"
                  {...register("websiteUrl")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-black"
                />
                {errors.websiteUrl && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.websiteUrl.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contactEmail"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contact Email
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  {...register("contactEmail")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-black"
                />
                {errors.contactEmail && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.contactEmail.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="jurisdiction"
                  className="block text-sm font-medium text-gray-700"
                >
                  Jurisdiction
                </label>
                <select
                  id="jurisdiction"
                  {...register("jurisdiction")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-black"
                >
                  <option value="">Select a jurisdiction</option>
                  {jurisdictions.map((jurisdiction) => (
                    <option key={jurisdiction} value={jurisdiction}>
                      {jurisdiction}
                    </option>
                  ))}
                </select>
                {errors.jurisdiction && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.jurisdiction.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Data Collection */}
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Data Collection
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What types of data do you collect?
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {dataTypes.map((type) => (
                    <div key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`dataType-${type}`}
                        value={type}
                        {...register("dataTypes")}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`dataType-${type}`}
                        className="ml-3 text-sm text-gray-700"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.dataTypes && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.dataTypes.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Third-Party Services
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {thirdPartyServices.map((service) => (
                    <div key={service} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`service-${service}`}
                        value={service}
                        {...register("thirdPartyServices")}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`service-${service}`}
                        className="ml-3 text-sm text-gray-700"
                      >
                        {service}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="cookieUsage"
                  {...register("cookieUsage")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="cookieUsage"
                  className="ml-3 text-sm text-gray-700"
                >
                  Do you use cookies on your website?
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="gdprCompliant"
                  {...register("gdprCompliant")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="gdprCompliant"
                  className="ml-3 text-sm text-gray-700"
                >
                  Do you need GDPR compliance?
                </label>
              </div>
            </div>
          </div>

          {/* Target Audience */}
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Target Audience
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {targetAudiences.map((audience) => (
                <div key={audience} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`audience-${audience}`}
                    value={audience}
                    {...register("targetAudience")}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`audience-${audience}`}
                    className="ml-3 text-sm text-gray-700"
                  >
                    {audience}
                  </label>
                </div>
              ))}
            </div>
            {errors.targetAudience && (
              <p className="mt-1 text-sm text-red-600">
                {errors.targetAudience.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isGenerating}
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isGenerating ? "Generating..." : "Generate Policy"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 