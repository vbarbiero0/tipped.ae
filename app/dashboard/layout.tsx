import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rescuer dashboard",
  robots: { index: false },
};

// The dashboard brings its own chrome (sidebar per page — the My-pets
// screen shows the rescuer card, the others don't). The marketing Header and
// Footer both return null on /dashboard* routes.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-paper">{children}</div>;
}
