import Link from "next/link";
import { Logo } from "@/components/brand/Mascots";
import { CONTACT_EMAIL } from "@/lib/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo light />
          <p>Play. Learn. Grow Together.<br />เล่นด้วยกัน เรียนรู้ไปด้วยกัน</p>
          <p className="footer__small">ไม่มีโฆษณาสำหรับเด็ก • ไม่มีแชทเปิด • พ่อแม่ควบคุมการซื้อ</p>
        </div>
        <div>
          <h3>ผลิตภัณฑ์</h3>
          <ul>
            <li><Link href="/#how">วิธีใช้งาน</Link></li>
            <li><Link href="/#planner">ทดลองแผนกิจกรรม</Link></li>
            <li><Link href="/#pricing">ราคา</Link></li>
            <li><Link href="/app/welcome/">ลองเล่นฟรี</Link></li>
          </ul>
        </div>
        <div>
          <h3>ช่วยเหลือ</h3>
          <ul>
            <li><Link href="/#faq">คำถามที่พบบ่อย</Link></li>
            <li><Link href="/contact/">ติดต่อเรา / ครูและโรงเรียน</Link></li>
            <li><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
          </ul>
        </div>
        <div>
          <h3>นโยบาย</h3>
          <ul>
            <li><Link href="/privacy/">ความเป็นส่วนตัว</Link></li>
            <li><Link href="/terms/">ข้อกำหนดการใช้งาน</Link></li>
            <li><Link href="/refunds/">การยกเลิกและคืนเงิน</Link></li>
          </ul>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>© 2026 Growlilo — ชื่อทางการค้าอยู่ระหว่างตรวจสอบ</span>
        <span>Alpha preview • เนื้อหาบางส่วนอยู่ระหว่างพัฒนา</span>
      </div>
    </footer>
  );
}
