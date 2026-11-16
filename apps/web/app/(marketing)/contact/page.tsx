import type { Metadata } from "next";
import { CONTACT_EMAIL } from "@/lib/site";
export const metadata: Metadata = { title: "ติดต่อเรา", alternates: { canonical: "/contact/" } };

export default function Contact() {
  return (
    <article className="legal">
      <h1>ติดต่อเรา</h1>
      <p>ยินดีรับฟังความคิดเห็นจากครอบครัว ครู และโรงเรียนที่สนใจร่วมทดลอง</p>
      <h2>อีเมล</h2>
      <p><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
      <h2>สำหรับครูและโรงเรียน</h2>
      <p>โครงการนำร่องสำหรับโรงเรียนอยู่ในแผนระยะถัดไป หากสนใจ ส่งอีเมลพร้อมชื่อโรงเรียนและช่วงชั้นที่สนใจได้เลย</p>
    </article>
  );
}
