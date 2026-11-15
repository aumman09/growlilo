import Link from "next/link";
import { Lilo } from "@/components/brand/Mascots";

export default function Offline() {
  return (
    <main className="screen screen--child">
      <section className="mcard">
        <Lilo size={120} expr="calm" />
        <h1>ตอนนี้ออฟไลน์อยู่</h1>
        <p className="mcard__do">หน้านี้ยังไม่ได้โหลดไว้ในเครื่อง ระหว่างรอ ลองเล่นนอกจอกัน:</p>
        <ul className="plain-list left">
          <li><b>นักสำรวจสีแดง</b> — หาของสีแดง 3 อย่าง แล้วพูดว่า “red!” ด้วยกัน</li>
          <li><b>หน้าบอกความรู้สึก</b> — ทำหน้าบอกความรู้สึก แล้วเล่าเรื่องดี ๆ 1 เรื่อง</li>
          <li><b>นับก้าวกระโดด</b> — กระโดดพร้อมนับ 1 ถึง 10</li>
        </ul>
        <p className="muted small">ผลกิจกรรมที่เล่นตอนออฟไลน์บันทึกไว้ในเครื่องนี้ การชำระเงินต้องออนไลน์</p>
        <Link className="btn btn--lg" href="/app/home/">กลับหน้าหลัก</Link>
      </section>
    </main>
  );
}
