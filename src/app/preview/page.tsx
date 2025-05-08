"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PreviewPolicy() {
  const { data: session } = useSession();
  const router = useRouter();
  const [policyData, setPolicyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get policy data from localStorage
    const storedData = localStorage.getItem('policyData');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setPolicyData(data);
      } catch (error) {
        console.error("Error parsing policy data:", error);
      }
    } else {
      // Redirect back to generate page if no data is available
      router.push("/generate");
    }
    setIsLoading(false);
  }, [router]);

  const handleDownloadPDF = () => {
    alert("PDF download feature will be available in the premium version!");
  };

  const handleDownloadHTML = () => {
    if (!policyData?.policyContent) return;
    
    // Convert markdown to HTML
    const markdownContent = policyData.policyContent;
    const htmlContent = markdownToHtml(markdownContent);
    
    // Add watermark and copy protection
    const completeHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${policyData.businessName} - Privacy Policy</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            padding: 40px;
            margin: 0;
            position: relative;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
          
          /* Watermark styling */
          body::before {
            content: "Generated with Privacy Policy Generator";
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 999;
            font-size: 60px;
            color: rgba(200, 200, 200, 0.2);
            display: flex;
            justify-content: center;
            align-items: center;
            transform: rotate(-45deg);
            pointer-events: none;
          }
          
          h1, h2, h3 {
            color: #2c3e50;
          }
          
          h1 {
            text-align: center;
            margin-bottom: 30px;
          }
          
          h2 {
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
            margin-top: 30px;
          }
          
          ul {
            padding-left: 20px;
          }
          
          .footer {
            margin-top: 40px;
            text-align: center;
            border-top: 1px solid #eee;
            padding-top: 20px;
            font-size: 0.9em;
            color: #666;
          }
          
          code {
            background-color: #f8f8f8;
            padding: 2px 5px;
            border-radius: 3px;
            font-size: 0.9em;
          }
          
          pre {
            background-color: #f8f8f8;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
          }
          
          a {
            color: #3498db;
            text-decoration: none;
          }
          
          a:hover {
            text-decoration: underline;
          }
          
          blockquote {
            border-left: 4px solid #eee;
            padding-left: 15px;
            color: #666;
            margin-left: 0;
          }
          
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
          }
          
          table, th, td {
            border: 1px solid #eee;
          }
          
          th, td {
            padding: 10px;
            text-align: left;
          }
          
          th {
            background-color: #f8f8f8;
          }
          
          /* Anti-copy measurements */
          body * {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
          }
          
          /* Disable right-click */
          body {
            oncontextmenu: "return false";
          }
        </style>
        <script>
          // Disable right-click
          document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
          });
          
          // Disable keyboard shortcuts
          document.addEventListener('keydown', function(e) {
            // Ctrl+C, Ctrl+A, etc.
            if ((e.ctrlKey || e.metaKey) && 
                (e.keyCode === 65 || e.keyCode === 67 || e.keyCode === 83 || e.keyCode === 80)) {
              e.preventDefault();
              return false;
            }
          });
        </script>
      </head>
      <body>
        ${htmlContent}
        <div class="footer">
          Generated with <a href="https://privacy-policy-generator.vercel.app" target="_blank">Privacy Policy Generator</a>
          • Upgrade to Premium to remove this watermark
        </div>
      </body>
      </html>
    `;
    
    // Create a blob with the HTML content
    const blob = new Blob([completeHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Create a link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `${policyData.businessName.replace(/\s+/g, '-').toLowerCase()}-privacy-policy.html`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Simple markdown to HTML converter
  const markdownToHtml = (markdown: string): string => {
    let html = markdown
      // Headers
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      
      // Lists
      .replace(/^\- (.*$)/gm, '<li>$1</li>')
      
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    
    // Wrap lists in <ul>
    let hasListItems = html.includes('<li>');
    if (hasListItems) {
      // Find all consecutive li elements and wrap them in ul tags
      let inList = false;
      let newHtml = '';
      const lines = html.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('<li>')) {
          if (!inList) {
            newHtml += '<ul>\n';
            inList = true;
          }
          newHtml += line + '\n';
        } else {
          if (inList) {
            newHtml += '</ul>\n';
            inList = false;
          }
          newHtml += line + '\n';
        }
      }
      
      if (inList) {
        newHtml += '</ul>\n';
      }
      
      html = newHtml;
    }
    
    // Convert line breaks to paragraphs
    html = '<p>' + html.replace(/\n\n/g, '</p><p>') + '</p>';
    
    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');
    
    return html;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!policyData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">No Policy Data Found</h1>
        <p className="mb-6">Please go back and fill out the form to generate a privacy policy.</p>
        <Link
          href="/generate"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Form
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy Preview</h1>
            <div className="space-x-4">
              <button
                onClick={handleDownloadHTML}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Download HTML
              </button>
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Download PDF
              </button>
            </div>
          </div>

          <div className="mb-4">
            <Link
              href="/generate"
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Generator
            </Link>
          </div>

          <div className="relative border rounded-lg p-6 prose max-w-none">
            {/* Watermark overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 overflow-hidden">
              <div style={{ transform: 'rotate(-30deg)' }} className="text-gray-400 text-8xl font-bold whitespace-nowrap">
                PREVIEW ONLY
              </div>
            </div>
            
            <div className="select-none">
              <pre className="whitespace-pre-wrap font-sans text-base">
                {policyData.policyContent}
              </pre>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center text-sm text-gray-600">
            This is a preview only. Download the policy to get the full document. 
            Generated with Privacy Policy Generator.
          </div>
        </div>
      </div>
    </div>
  );
} 