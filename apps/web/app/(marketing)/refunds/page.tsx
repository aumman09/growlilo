import type { Metadata } from "next";
export const metadata: Metadata = { title: "การยกเลิกและคืนเงิน", alternates: { canonical: "/refunds/" } };

export default function Refunds() {
  return (
    <article className="legal">
      <h1>การยกเลิกและคืนเงิน</h1>
      <p className="legal__draft">ยังไม่เปิดรับชำระเงิน — นโยบายฉบับจริงจะเผยแพร่และผ่านการตรวจทางกฎหมาย/บัญชีก่อนเปิด Family Plus</p>
      <h2>หลักการที่วางไว้</h2>
      <ul>
        <li>ยกเลิกได้เองตลอดเวลาในโซนผู้ปกครอง โดยไม่ต้องติดต่อเจ้าหน้าที่</li>
        <li>หลังยกเลิก ยังใช้งานได้จนสิ้นสุดรอบที่ชำระแล้ว และกลับไปใช้แพ็กฟรีโดยอัตโนมัติ</li>
        <li>การชำระผ่าน PromptPay เป็นการชำระครั้งเดียว ไม่ต่ออายุอัตโนมัติ</li>
        <li>การตั้งเวลาหน้าจอและความปลอดภัยของเด็กใช้ได้ฟรีเสมอ ไม่ว่าจะยกเลิกหรือไม่</li>
      </ul>
    </article>
  );
}
