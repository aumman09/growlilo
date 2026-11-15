"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Mascots";

const LINKS = [
  { href: "/#how", label: "วิธีใช้งาน" },
  { href: "/#learn", label: "เรียนอะไร" },
  { href: "/#parents", label: "สำหรับพ่อแม่" },
  { href: "/#pricing", label: "ราคา" },
  { href: "/#faq", label: "FAQ" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="nav__inner">
        <Link href="/" aria-label="Growlilo หน้าแรก" className="nav__brand"><Logo /></Link>
        <nav aria-label="เมนูหลัก" className="nav__links">
          {LINKS.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
        </nav>
        <div className="nav__cta">
          <Link className="btn btn--sm" href="/app/welcome/">ลองเล่นฟรี</Link>
          <button className="nav__burger" aria-label={open ? "ปิดเมนู" : "เปิดเมนู"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((v) => !v)}>
            <span /><span /><span />
          </button>
        </div>
      </div>
      <div id="mobile-menu" className={`drawer ${open ? "drawer--open" : ""}`} hidden={!open}>
        <nav aria-label="เมนูมือถือ">
          {LINKS.map((l) => <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>)}
          <Link className="btn btn--block btn--lg" href="/app/welcome/" onClick={() => setOpen(false)}>ลองเล่นฟรี</Link>
        </nav>
      </div>
    </header>
  );
}
