import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Documentation - Client Management System",
  description: "Interactive API documentation for the Client Management System",
};

export default function ApiDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
