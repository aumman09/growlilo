import type { Metadata } from "next";
import "@/styles/app.css";
import { AppFrame } from "@/components/app/AppFrame";

export const metadata: Metadata = {
  title: "แอป",
  robots: { index: false, follow: false },
};

/** Child + parent PWA surface: no marketing CTA, no external links, no ads (PRD §3.2, §12). */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppFrame>{children}</AppFrame>;
}
