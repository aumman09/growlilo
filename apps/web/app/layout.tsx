import type { Metadata, Viewport } from "next";
import "@fontsource/noto-sans-thai/thai-400.css";
import "@fontsource/noto-sans-thai/thai-500.css";
import "@fontsource/noto-sans-thai/thai-700.css";
import "@fontsource/nunito/latin-400.css";
import "@fontsource/nunito/latin-700.css";
import "@fontsource/nunito/latin-800.css";
import "@/styles/tokens.css";
import "@/styles/base.css";
import { DESCRIPTION_TH, SITE_NAME, SITE_URL, TAGLINE_TH } from "@/lib/site";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — ${TAGLINE_TH} | เกมเรียนรู้และกิจกรรมพ่อแม่ลูก`, template: `%s | ${SITE_NAME}` },
  description: DESCRIPTION_TH,
  applicationName: SITE_NAME,
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${TAGLINE_TH}`,
    description: DESCRIPTION_TH,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Growlilo — เล่นด้วยกัน เรียนรู้ไปด้วยกัน" }],
  },
  twitter: { card: "summary_large_image", title: `${SITE_NAME} — ${TAGLINE_TH}`, description: DESCRIPTION_TH, images: ["/og-image.png"] },
  icons: { icon: [{ url: "/icons/icon.svg", type: "image/svg+xml" }, { url: "/icons/icon-192.png", sizes: "192x192" }], apple: "/icons/apple-touch-icon.png" },
  appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#FFF9EE",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
