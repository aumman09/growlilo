import Link from "next/link";
import { Grow, Lilo } from "@/components/brand/Mascots";
import { Toy } from "@/components/brand/Toys";

function PhoneDemo() {
  return (
    <div className="phone" aria-label="ภาพตัวอย่างหน้าจอเกม จับคู่สีสนุก" role="img">
      <div className="phone__notch" />
      <div className="phone__screen">
        <div className="phone__hud">
          <span className="phone__pill">English • 2/6</span>
          <span className="phone__dots"><i className="on" /><i className="on" /><i /><i /><i /><i /></span>
        </div>
        <p className="phone__prompt">Find <b>red</b>!</p>
        <p className="phone__caption">เร็ด • สีแดง</p>
        <div className="phone__choices">
          <span className="phone__choice"><Toy kind="balloon" color="blue" size={64} /></span>
          <span className="phone__choice phone__choice--ok"><Toy kind="balloon" color="red" size={64} /></span>
          <span className="phone__choice"><Toy kind="balloon" color="yellow" size={64} /></span>
        </div>
        <div className="phone__feedback">✓ Red balloon! ลูกโป่งสีแดง</div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden>
        <span className="blob blob--a" /><span className="blob blob--b" /><span className="blob blob--c" />
      </div>
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow"><span className="dot" />เวลาสั้น ๆ ที่ได้ใกล้ชิดกันมากขึ้น</p>
          <h1 id="hero-title" className="hero__title">
            เล่นด้วยกัน<br /><span className="hl">เรียนรู้</span>ไปด้วยกัน
          </h1>
          <p className="hero__sub">
            Growlilo ช่วยพ่อแม่เปลี่ยนเวลาสั้น ๆ ให้เป็นเกมเรียนรู้และกิจกรรมสนุกที่ทำกับลูกได้จริง —
            เล่นบนจอแค่ไม่กี่นาที แล้วชวนกันออกไปเล่นในโลกจริง
          </p>
          <div className="hero__ctas">
            <Link className="btn btn--lg" href="/app/welcome/">ลองกิจกรรมฟรี <span className="arrow" aria-hidden>→</span></Link>
            <a className="btn btn--lg btn--ghost" href="#how">ดูวิธีเล่น 3 ขั้นตอน</a>
          </div>
          <ul className="hero__values" aria-label="จุดเด่น">
            <li>ไม่ต้องคิดเกมเอง</li>
            <li>ไม่ต้องเตรียมของเยอะ</li>
            <li>จบจอแล้วไปเล่นจริง</li>
          </ul>
        </div>
        <div className="hero__art">
          <div className="hero__stage">
            <Grow size={190} className="hero__grow anim-float" />
            <PhoneDemo />
            <Lilo size={150} wave className="hero__lilo anim-float" style={{ animationDelay: "-1.6s" }} />
            <div className="floatcard floatcard--a">
              <span className="floatcard__icon floatcard__icon--red" aria-hidden />
              <div><b>ภารกิจนอกจอ</b><small>หาของสีแดง 3 อย่าง</small></div>
            </div>
            <div className="floatcard floatcard--b">
              <span className="floatcard__icon floatcard__icon--leaf" aria-hidden>✓</span>
              <div><b>เกมจบแล้ว</b><small>พักสายตา 4 นาที</small></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
