"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler, UseFormReturn } from "react-hook-form";
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
  businessAddress: z.string().min(1, "Business address is required"),
  requiresDpo: z.boolean(),
  dataProtectionOfficer: z.object({
    name: z.string().min(1, "DPO name is required"),
    email: z.string().email("Please enter a valid DPO email"),
  }).optional().superRefine((val, ctx) => {
    // @ts-ignore - ctx.parent is available at runtime
    if (ctx.parent?.requiresDpo && (!val || !val.name || !val.email)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "DPO information is required based on your organization type and activities",
        path: []
      });
    }
  }),
  dataTypes: z.array(z.string()).min(1, "Select at least one data type"),
  dataPurposes: z.array(z.string()).min(1, "Select at least one data purpose"),
  dataRetentionPeriod: z.string().min(1, "Data retention period is required"),
  thirdPartyServices: z.array(z.string()),
  dataTransfers: z.array(z.string()),
  cookieUsage: z.boolean(),
  gdprCompliant: z.boolean(),
  ccpaCompliant: z.boolean(),
  pipedrCompliant: z.boolean(),
  targetAudience: z.array(z.string()).min(1, "Select at least one target audience"),
  securityMeasures: z.array(z.string()).min(1, "Select at least one security measure"),
  breachNotificationProcess: z.string().min(1, "Breach notification process is required"),
  lastReviewDate: z.string().optional(),
  effectiveDate: z.string().min(1, "Effective date is required"),
  versionNumber: z.string().min(1, "Version number is required"),
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
  "Biometric Data",
  "Health Data",
  "Financial Data",
  "Social Media Data",
  "Professional Information",
  "Educational Information",
  "Government ID Numbers",
  "Other"
];

const dataPurposes = [
  "Service Provision",
  "Account Management",
  "Communication",
  "Marketing",
  "Analytics",
  "Legal Compliance",
  "Security",
  "Product Improvement",
  "Customer Support",
  "Personalization",
  "Research"
];

const thirdPartyServices = [
  "Google Analytics",
  "Stripe",
  "PayPal",
  "Mailchimp",
  "HubSpot",
  "Facebook Pixel",
  "AWS",
  "Microsoft Azure",
  "Salesforce",
  "Zendesk",
  "Intercom",
  "Other"
];

const dataTransfers = [
  "EU/EEA",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Asia Pacific",
  "Other"
];

const jurisdictions = [
  "EU (GDPR)",
  "US (CCPA/CPRA)",
  "UK (UK GDPR)",
  "Canada (PIPEDA)",
  "Brazil (LGPD)",
  "Australia (Privacy Act)",
  "China (PIPL)",
  "Japan (APPI)",
  "Singapore (PDPA)",
  "Other"
];

const securityMeasures = [
  "Encryption at Rest",
  "Encryption in Transit",
  "Access Controls",
  "Regular Security Audits",
  "Employee Training",
  "Incident Response Plan",
  "Data Backup",
  "Network Security",
  "Physical Security",
  "Vendor Assessment"
];

const targetAudiences = [
  "EU Residents",
  "US Residents",
  "Children Under 13",
  "Children 13-16",
  "Healthcare Patients",
  "Business Clients",
  "Job Applicants",
  "Website Visitors",
  "Mobile App Users",
  "General Public"
];

// Function to generate privacy policy content from form data
const generatePolicy = (data: FormData): string => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formattedEffectiveDate = formatDate(data.effectiveDate);
  
  return `
# PRIVACY POLICY

**Version ${data.versionNumber}**
**Effective Date: ${formattedEffectiveDate}**

## 1. INTRODUCTION

${data.businessName} ("we," "our," or "us") respects your privacy and is committed to protecting it through our compliance with this policy.

This Privacy Policy (our "Privacy Policy") describes how we collect, use, process, and disclose your information, including personal information, in conjunction with your access to and use of our website: ${data.websiteUrl}.

When you use our services, you trust us with your information. This Privacy Policy is meant to help you understand what data we collect, why we collect it, and what we do with it.

## 2. INFORMATION WE COLLECT

We collect several types of information from and about users of our website, including information:
${data.dataTypes.map(type => `- ${type}`).join('\n')}

## 3. HOW WE USE YOUR INFORMATION

We use information that we collect about you or that you provide to us, including any personal information:
${data.dataPurposes.map(purpose => `- ${purpose}`).join('\n')}

## 4. DATA RETENTION

We will retain your personal information for the length of time needed to fulfill the purposes outlined in this Privacy Policy unless a longer retention period is required or permitted by law. Our data retention period is: ${data.dataRetentionPeriod}.

## 5. INFORMATION SHARING AND DISCLOSURE

We may disclose aggregated information about our users and information that does not identify any individual without restriction.

We may disclose personal information that we collect or you provide:
${data.thirdPartyServices.length > 0 ? 
  `- To third-party service providers we use to support our business, including:\n${data.thirdPartyServices.map(service => `  - ${service}`).join('\n')}` : 
  '- We do not share your personal information with third parties.'
}

## 6. DATA TRANSFERS

${data.dataTransfers.length > 0 ?
  `We may transfer your personal information to the following countries:\n${data.dataTransfers.map(country => `- ${country}`).join('\n')}` :
  'We do not transfer your personal information internationally.'
}

${data.gdprCompliant ? `
## 7. YOUR RIGHTS UNDER GDPR

If you are located in the European Economic Area (EEA), you have certain rights regarding your personal information:
- Right to access 
- Right to rectification
- Right to erasure
- Right to restrict processing
- Right to data portability
- Right to object
- Rights related to automated decision-making and profiling
` : ''}

${data.ccpaCompliant ? `
## ${data.gdprCompliant ? '8' : '7'}. YOUR RIGHTS UNDER CCPA/CPRA

If you are a California resident, you have the following rights:
- Right to know about personal information collected, disclosed, or sold
- Right to delete personal information
- Right to opt-out of the sale of personal information
- Right to non-discrimination
` : ''}

${data.pipedrCompliant ? `
## ${data.gdprCompliant && data.ccpaCompliant ? '9' : data.gdprCompliant || data.ccpaCompliant ? '8' : '7'}. YOUR RIGHTS UNDER PIPEDA

If you are a Canadian resident, you have the right to:
- Access your personal information
- Challenge the accuracy of your personal information
- Withdraw consent to the collection, use, or disclosure of your personal information
` : ''}

## ${data.gdprCompliant && data.ccpaCompliant && data.pipedrCompliant ? '10' : 
     data.gdprCompliant && data.ccpaCompliant || data.gdprCompliant && data.pipedrCompliant || data.ccpaCompliant && data.pipedrCompliant ? '9' :
     data.gdprCompliant || data.ccpaCompliant || data.pipedrCompliant ? '8' : '7'}. SECURITY

We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. These measures include:
${data.securityMeasures.map(measure => `- ${measure}`).join('\n')}

## ${data.gdprCompliant && data.ccpaCompliant && data.pipedrCompliant ? '11' : 
     data.gdprCompliant && data.ccpaCompliant || data.gdprCompliant && data.pipedrCompliant || data.ccpaCompliant && data.pipedrCompliant ? '10' :
     data.gdprCompliant || data.ccpaCompliant || data.pipedrCompliant ? '9' : '8'}. DATA BREACH NOTIFICATION

In the event of a data breach, we will notify the relevant supervisory authorities and affected users ${data.breachNotificationProcess}.

${data.cookieUsage ? `
## ${data.gdprCompliant && data.ccpaCompliant && data.pipedrCompliant ? '12' : 
      data.gdprCompliant && data.ccpaCompliant || data.gdprCompliant && data.pipedrCompliant || data.ccpaCompliant && data.pipedrCompliant ? '11' :
      data.gdprCompliant || data.ccpaCompliant || data.pipedrCompliant ? '10' : '9'}. COOKIES AND TRACKING TECHNOLOGIES

We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
` : ''}

${data.requiresDpo ? `
## ${data.gdprCompliant && data.ccpaCompliant && data.pipedrCompliant && data.cookieUsage ? '13' : 
      (data.gdprCompliant && data.ccpaCompliant && data.pipedrCompliant) || 
      (data.gdprCompliant && data.ccpaCompliant && data.cookieUsage) || 
      (data.gdprCompliant && data.pipedrCompliant && data.cookieUsage) || 
      (data.ccpaCompliant && data.pipedrCompliant && data.cookieUsage) ? '12' :
      (data.gdprCompliant && data.ccpaCompliant) || 
      (data.gdprCompliant && data.pipedrCompliant) || 
      (data.ccpaCompliant && data.pipedrCompliant) || 
      (data.gdprCompliant && data.cookieUsage) || 
      (data.ccpaCompliant && data.cookieUsage) || 
      (data.pipedrCompliant && data.cookieUsage) ? '11' :
      data.gdprCompliant || data.ccpaCompliant || data.pipedrCompliant || data.cookieUsage ? '10' : '9'}. DATA PROTECTION OFFICER

Our Data Protection Officer is:
- Name: ${data.dataProtectionOfficer?.name || ''}
- Email: ${data.dataProtectionOfficer?.email || ''}
` : ''}

## CONTACT US

If you have any questions about this Privacy Policy, please contact us at:

${data.businessName}
${data.businessAddress}
Email: ${data.contactEmail}
${data.websiteUrl}

---

Last Updated: ${formattedEffectiveDate}
`;
};

export default function GeneratePolicy() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [requiresDpo, setRequiresDpo] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataTypes: [],
      thirdPartyServices: [],
      dataTransfers: [],
      dataPurposes: [],
      targetAudience: [],
      securityMeasures: [],
      cookieUsage: false,
      gdprCompliant: false,
      ccpaCompliant: false,
      pipedrCompliant: false,
      requiresDpo: false,
      effectiveDate: new Date().toISOString().split('T')[0],
      versionNumber: "1.0",
    },
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;

  // Watch values that affect DPO requirement
  const selectedJurisdiction = watch("jurisdiction");
  const selectedDataTypes = watch("dataTypes") || [];
  const gdprCompliant = watch("gdprCompliant");

  // Effect to determine if DPO is required
  useEffect(() => {
    const hasSpecialCategories = selectedDataTypes?.some(type => 
      ["Health Data", "Biometric Data", "Government ID Numbers"].includes(type)
    );
    const isEUJurisdiction = selectedJurisdiction === "EU (GDPR)" || gdprCompliant;
    const needsDpo = hasSpecialCategories && isEUJurisdiction;
    
    setValue("requiresDpo", needsDpo);
    setRequiresDpo(needsDpo);
  }, [selectedJurisdiction, selectedDataTypes, gdprCompliant, setValue]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log("Form submitted with data:", data);
    setIsGenerating(true);
    try {
      // Generate the policy content
      const policyContent = generatePolicy(data);
      console.log("Policy generated successfully");
      
      // Store form data and policy content in localStorage
      localStorage.setItem('policyData', JSON.stringify({
        ...data,
        effectiveDate: data.effectiveDate,
        lastReviewDate: data.lastReviewDate,
        policyContent: policyContent
      }));
      console.log("Data stored in localStorage");
      
      // Redirect to preview page
      console.log("Redirecting to preview page...");
      window.location.href = "/preview";
    } catch (error) {
      console.error("Error generating policy:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function for array field registration
  const handleArrayFieldChange = (field: keyof FormData, value: string) => {
    const currentValues = (watch(field) as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    setValue(field, newValues);
  };

  // Helper function to check if a value is in an array field
  const isValueSelected = (field: keyof FormData, value: string): boolean => {
    const values = (watch(field) as string[]) || [];
    return values.includes(value);
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
            <div className="space-y-4">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                  Business Name
                </label>
                <input
                  type="text"
                  id="businessName"
                  {...register("businessName")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.businessName && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
                  Business Type
                </label>
                <input
                  type="text"
                  id="businessType"
                  {...register("businessType")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.businessType && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessType.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700">
                  Business Address
                </label>
                <textarea
                  id="businessAddress"
                  {...register("businessAddress")}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.businessAddress && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessAddress.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700">
                    Website URL
                  </label>
                  <input
                    type="url"
                    id="websiteUrl"
                    {...register("websiteUrl")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.websiteUrl && (
                    <p className="mt-1 text-sm text-red-600">{errors.websiteUrl.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    {...register("contactEmail")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.contactEmail && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Requirements */}
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Compliance Requirements
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="jurisdiction" className="block text-sm font-medium text-gray-700">
                  Primary Jurisdiction
                </label>
                <select
                  id="jurisdiction"
                  {...register("jurisdiction")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select a jurisdiction</option>
                  {jurisdictions.map((jurisdiction) => (
                    <option key={jurisdiction} value={jurisdiction}>
                      {jurisdiction}
                    </option>
                  ))}
                </select>
                {errors.jurisdiction && (
                  <p className="mt-1 text-sm text-red-600">{errors.jurisdiction.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="gdprCompliant"
                    {...register("gdprCompliant")}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="gdprCompliant" className="ml-3 text-sm text-gray-700">
                    GDPR Compliance Required
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="ccpaCompliant"
                    {...register("ccpaCompliant")}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="ccpaCompliant" className="ml-3 text-sm text-gray-700">
                    CCPA/CPRA Compliance Required
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pipedrCompliant"
                    {...register("pipedrCompliant")}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="pipedrCompliant" className="ml-3 text-sm text-gray-700">
                    PIPEDA Compliance Required
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Data Protection Officer */}
          <div className="bg-white shadow sm:rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Data Protection Officer
              </h2>
              {requiresDpo && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-red-100 text-red-800">
                  Required
                </span>
              )}
            </div>
            
            {requiresDpo && (
              <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Based on your jurisdiction and data processing activities, you are required to appoint a Data Protection Officer under GDPR Article 37.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="dpoName" className="block text-sm font-medium text-gray-700">
                  DPO Name {requiresDpo && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  id="dpoName"
                  {...register("dataProtectionOfficer.name")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.dataProtectionOfficer?.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.dataProtectionOfficer.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="dpoEmail" className="block text-sm font-medium text-gray-700">
                  DPO Email {requiresDpo && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="email"
                  id="dpoEmail"
                  {...register("dataProtectionOfficer.email")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.dataProtectionOfficer?.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.dataProtectionOfficer.email.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Data Collection */}
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Data Collection</h2>
            <div className="space-y-4">
              {/* Data Types */}
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
                        checked={isValueSelected("dataTypes", type)}
                        onChange={() => handleArrayFieldChange("dataTypes", type)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`dataType-${type}`} className="ml-3 text-sm text-gray-700">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.dataTypes && (
                  <p className="mt-1 text-sm text-red-600">{errors.dataTypes.message}</p>
                )}
              </div>

              {/* Data Purposes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What purposes do you use this data for?
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {dataPurposes.map((purpose) => (
                    <div key={purpose} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`dataPurpose-${purpose}`}
                        checked={isValueSelected("dataPurposes", purpose)}
                        onChange={() => handleArrayFieldChange("dataPurposes", purpose)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`dataPurpose-${purpose}`} className="ml-3 text-sm text-gray-700">
                        {purpose}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.dataPurposes && (
                  <p className="mt-1 text-sm text-red-600">{errors.dataPurposes.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="dataRetentionPeriod" className="block text-sm font-medium text-gray-700">
                  How long do you retain the data?
                </label>
                <select
                  id="dataRetentionPeriod"
                  {...register("dataRetentionPeriod")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select retention period</option>
                  <option value="as-needed">As long as needed for the purpose</option>
                  <option value="1-year">1 year</option>
                  <option value="2-years">2 years</option>
                  <option value="3-years">3 years</option>
                  <option value="5-years">5 years</option>
                  <option value="7-years">7 years</option>
                  <option value="indefinite">Indefinitely</option>
                </select>
                {errors.dataRetentionPeriod && (
                  <p className="mt-1 text-sm text-red-600">{errors.dataRetentionPeriod.message}</p>
                )}
              </div>

              {/* Third Party Services */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Which third-party services do you use?
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {thirdPartyServices.map((service) => (
                    <div key={service} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`thirdPartyService-${service}`}
                        checked={isValueSelected("thirdPartyServices", service)}
                        onChange={() => handleArrayFieldChange("thirdPartyServices", service)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`thirdPartyService-${service}`} className="ml-3 text-sm text-gray-700">
                        {service}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Transfers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Where do you transfer data?
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {dataTransfers.map((transfer) => (
                    <div key={transfer} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`dataTransfer-${transfer}`}
                        checked={isValueSelected("dataTransfers", transfer)}
                        onChange={() => handleArrayFieldChange("dataTransfers", transfer)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`dataTransfer-${transfer}`} className="ml-3 text-sm text-gray-700">
                        {transfer}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="cookieUsage"
                    {...register("cookieUsage")}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="cookieUsage" className="ml-3 text-sm text-gray-700">
                    Use cookies and similar tracking technologies
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Security Measures */}
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Security Measures
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What security measures do you implement?
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {securityMeasures.map((measure) => (
                    <div key={measure} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`security-${measure}`}
                        checked={isValueSelected("securityMeasures", measure)}
                        onChange={() => handleArrayFieldChange("securityMeasures", measure)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`security-${measure}`} className="ml-3 text-sm text-gray-700">
                        {measure}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.securityMeasures && (
                  <p className="mt-1 text-sm text-red-600">{errors.securityMeasures.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="breachNotificationProcess" className="block text-sm font-medium text-gray-700">
                  Data Breach Notification Process
                </label>
                <select
                  id="breachNotificationProcess"
                  {...register("breachNotificationProcess")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select notification timeframe</option>
                  <option value="24-hours">Within 24 hours</option>
                  <option value="72-hours">Within 72 hours (GDPR requirement)</option>
                  <option value="7-days">Within 7 days</option>
                  <option value="30-days">Within 30 days</option>
                </select>
                {errors.breachNotificationProcess && (
                  <p className="mt-1 text-sm text-red-600">{errors.breachNotificationProcess.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Target Audience */}
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Target Audience
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Who is your target audience?
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {targetAudiences.map((audience) => (
                    <div key={audience} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`audience-${audience}`}
                        checked={isValueSelected("targetAudience", audience)}
                        onChange={() => handleArrayFieldChange("targetAudience", audience)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`audience-${audience}`} className="ml-3 text-sm text-gray-700">
                        {audience}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.targetAudience && (
                  <p className="mt-1 text-sm text-red-600">{errors.targetAudience.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Policy Information */}
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Policy Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700">
                    Effective Date
                  </label>
                  <input
                    type="date"
                    id="effectiveDate"
                    {...register("effectiveDate")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.effectiveDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.effectiveDate.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="versionNumber" className="block text-sm font-medium text-gray-700">
                    Version Number
                  </label>
                  <input
                    type="text"
                    id="versionNumber"
                    {...register("versionNumber")}
                    placeholder="e.g., 1.0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  {errors.versionNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.versionNumber.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isGenerating}
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              onClick={() => {
                if (Object.keys(errors).length === 0) {
                  console.log("Form is valid, submitting...");
                } else {
                  console.log("Form has errors:", errors);
                }
              }}
            >
              {isGenerating ? "Generating..." : "Generate Policy"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}