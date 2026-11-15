import "@/styles/marketing.css";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { RevealOnScroll } from "@/components/marketing/Reveal";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">ข้ามไปเนื้อหาหลัก</a>
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
      <RevealOnScroll />
    </>
  );
}
