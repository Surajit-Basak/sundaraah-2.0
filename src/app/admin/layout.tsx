
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sundaraah Admin",
  description: "Admin dashboard for Sundaraah Showcase",
};

// This is now a simple pass-through layout. 
// The actual admin layout with the sidebar is in (dashboard)/layout.tsx
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
