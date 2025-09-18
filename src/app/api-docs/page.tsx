"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import "./globals.css";

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Client Management System API Documentation
          </h1>
          <p className="text-gray-600 mb-4">
            Interactive API documentation for testing and exploring all
            available endpoints.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Authentication
            </h3>
            <p className="text-blue-800 text-sm">
              Most endpoints require authentication using Clerk JWT tokens. You
              can get your token from the browser&apos;s developer tools when
              logged in.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <SwaggerUI
            url="/api/swagger"
            docExpansion="list"
            deepLinking={true}
            displayRequestDuration={true}
            tryItOutEnabled={true}
          />
        </div>
      </div>
    </div>
  );
}
