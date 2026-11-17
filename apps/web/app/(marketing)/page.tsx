import Link from "next/link";
import { Hero } from "@/components/marketing/Hero";
import { PlannerTeaser } from "@/components/marketing/PlannerTeaser";
import { Pricing } from "@/components/marketing/Pricing";
import { Faq } from "@/components/marketing/Faq";
import { EnglishSpotlight } from "@/components/marketing/EnglishSpotlight";
import { Grow, Lilo } from "@/components/brand/Mascots";
import { Toy } from "@/components/brand/Toys";
import { SITE_NAME, SITE_URL, DESCRIPTION_TH } from "@/lib/site";
import { WorksheetSheet } from "@/components/library/WorksheetSheet";
import { Scene } from "@/components/library/Scene";
import { ALL_STORIES, ALL_WORKSHEETS, getStory, getWorksheet } from "@/lib/content";

function SectionHead({ kicker, title, sub, id }: { kicker: string; title: React.ReactNode; sub?: string; id: string }) {
  return (
    <div className="shead" data-reveal>
      <p className="kicker">{kicker}</p>
      <h2 id={id}>{title}</h2>
      {sub && <p className="shead__sub">{sub}</p>}
    </div>
  );
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/icons/icon-512.png` },
    { "@type": "WebSite", name: SITE_NAME, url: SITE_URL, inLanguage: "th", description: DESCRIPTION_TH },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />

      {/* 03 — honest social proof: who it is designed for (no fake stats or quotes) */}
      <section className="designed" aria-labelledby="designed-title">
        <div className="container">
          <h2 id="designed-title" className="designed__title" data-reveal>ออกแบบเพื่อ…</h2>
          <ul className="designed__list" data-reveal data-delay="1">
            <li><b>ครอบครัวที่มีเวลาน้อย</b><span>วันละ 10–15 นาทีก็เริ่มได้</span></li>
            <li><b>เด็ก 4–8 ปี</b><span>ปุ่มใหญ่ เสียงชัด ข้อความน้อย</span></li>
            <li><b>พ่อแม่ที่ไม่ถนัดอังกฤษ</b><span>มีคำอ่านไทยและคำแปลทุกคำ</span></li>
            <li><b>บ้านที่อยากใช้จอแบบมีขอบเขต</b><span>จบเกมแล้วพักจอเสมอ</span></li>
          </ul>
          <a href="#planner" className="designed__link">ดูตัวอย่างแผนกิจกรรม →</a>
        </div>
      </section>

      {/* 04 — problem → solution */}
      <section className="section" aria-labelledby="problem-title">
        <div className="container">
          <SectionHead id="problem-title" kicker="ทำไมต้อง Growlilo" title={<>อยากใช้เวลากับลูกให้มีความหมาย<br className="br-d" />แต่บางวันก็คิดไม่ออก</>} />
          <div className="ps">
            <ul className="ps__pains" data-reveal>
              <li><span className="ps__q">“</span>เลิกงานมาเหนื่อย ไม่มีแรงคิดว่าจะเล่นอะไรกับลูก</li>
              <li><span className="ps__q">“</span>ให้ลูกเล่นแท็บเล็ตแล้วกังวลว่าจะติดจอ</li>
              <li><span className="ps__q">“</span>อยากรู้ว่าลูกได้อะไรจากกิจกรรมบ้าง โดยไม่กดดัน</li>
            </ul>
            <div className="ps__promises">
              {[
                { t: "พร้อมเล่นทันที", d: "เกมสั้นและภารกิจที่ใช้ของในบ้าน ไม่ต้องเตรียมอุปกรณ์", c: "leaf" },
                { t: "ต่อยอดนอกจอ", d: "ทุกเกมจบด้วยการพักสายตาและกิจกรรมทำด้วยกันจริง", c: "peach" },
                { t: "เห็นการเรียนรู้", d: "สรุปสิ่งที่ลูกได้ลองแบบเข้าใจง่าย ไม่ใช่คะแนนแข่งขัน", c: "blue" },
              ].map((p, i) => (
                <article key={p.t} className={`promise promise--${p.c}`} data-reveal data-delay={String(i + 1)}>
                  <span className="promise__n">0{i + 1}</span>
                  <h3>{p.t}</h3>
                  <p>{p.d}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="center" data-reveal><Link className="btn btn--lg" href="/app/welcome/">เริ่มที่บ้านวันนี้</Link></div>
        </div>
      </section>

      {/* 05 — 3 steps scroll story */}
      <section id="how" className="section section--tint" aria-labelledby="how-title">
        <div className="container">
          <SectionHead id="how-title" kicker="วิธีเล่น 3 ขั้นตอน" title="จากจอเล็ก ๆ สู่เวลาดี ๆ ด้วยกัน" sub="ทั้งหมดใช้เวลาประมาณ 15 นาที — บนจอเพียงไม่กี่นาที" />
          <ol className="steps">
            <li className="step" data-reveal>
              <div className="step__copy">
                <span className="step__n">1</span>
                <h3>เล่นเกมสั้น 3–5 นาที</h3>
                <p>ลูกฟังคำ แตะคำตอบ ได้กำลังใจทันทีเมื่อตอบถูก และได้ลองใหม่อย่างอ่อนโยนเมื่อพลาด ไม่มีนาฬิกานับถอยหลังกดดัน</p>
              </div>
              <div className="step__art step__art--blue" aria-hidden>
                <div className="mini">
                  <p className="mini__prompt">Find <b>blue</b>!</p>
                  <div className="mini__row"><Toy kind="fish" color="green" size={70} /><Toy kind="fish" color="blue" size={70} /><Toy kind="fish" color="red" size={70} /></div>
                </div>
              </div>
            </li>
            <li className="step step--rev" data-reveal>
              <div className="step__copy">
                <span className="step__n">2</span>
                <h3>พักจอ แล้วทำภารกิจด้วยกัน</h3>
                <p>เกมจบแบบนุ่มนวล ไม่มีด่านต่อไปอัตโนมัติ ลูกได้การ์ดภารกิจง่าย ๆ ส่วนพ่อแม่ได้ขั้นตอน ประโยคชวนคุย และข้อควรระวัง</p>
              </div>
              <div className="step__art step__art--peach" aria-hidden>
                <div className="mission-mini">
                  <Lilo size={84} expr="happy" />
                  <div><b>นักสำรวจสีแดง</b><span>หาของสีแดง 3 อย่าง แล้วพูดว่า “red!” ด้วยกัน</span></div>
                </div>
              </div>
            </li>
            <li className="step" data-reveal>
              <div className="step__copy">
                <span className="step__n">3</span>
                <h3>ยืนยัน แล้วรู้ก้าวถัดไป</h3>
                <p>พ่อแม่กดยืนยันในโซนผู้ปกครอง ระบบสรุปสิ่งที่ลูกได้ฝึก และแนะนำกิจกรรมถัดไปพร้อมเหตุผลที่อ่านเข้าใจง่าย</p>
              </div>
              <div className="step__art step__art--leaf" aria-hidden>
                <div className="next-mini">
                  <span className="chip chip--leaf">ทำได้ในกิจกรรมนี้</span>
                  <p><b>ลองต่อ:</b> เดินเล่นตามล่าสี</p>
                  <small>เพราะลูกจำคำว่า red ได้แล้ว ลองฝึกสีอื่นนอกบ้าน</small>
                </div>
              </div>
            </li>
          </ol>
          <div className="center" data-reveal><Link className="btn btn--lg btn--peach" href="/app/welcome/">ดูเกมตัวอย่าง</Link></div>
        </div>
      </section>

      {/* 06 — planner teaser */}
      <section id="planner" className="section" aria-labelledby="planner-title">
        <div className="container">
          <SectionHead id="planner-title" kicker="ลองจัดแผนวันนี้" title="บอกเวลาที่มี แล้วเราจัดให้" sub="เลือกอายุ เวลา และเรื่องที่อยากฝึก ระบบจะจัดแผนตามกฎที่ครูกำหนดไว้ (ไม่ใช่ AI) — เวลาหน้าจอไม่เกินที่ตั้งไว้เสมอ" />
          <div data-reveal><PlannerTeaser /></div>
        </div>
      </section>

      {/* 07 — learning worlds */}
      <section id="learn" className="section section--tint" aria-labelledby="learn-title">
        <div className="container">
          <SectionHead id="learn-title" kicker="โลกแห่งการเรียนรู้" title="เริ่มจาก 3 โลก แล้วค่อย ๆ เติบโต" />
          <div className="worlds">
            {[
              { t: "English", th: "ภาษาอังกฤษ", d: "ฟัง พูด คำศัพท์รอบตัว และโฟนิกส์เบื้องต้น", c: "blue", s: "เล่นได้แล้ว" },
              { t: "ภาษาไทย", th: "Thai", d: "เสียงพยัญชนะ ก–ฮ และการอ่านสะกดเบื้องต้น", c: "peach", s: "กำลังพัฒนา" },
              { t: "Math", th: "คณิตศาสตร์", d: "นับ 1–10 รูปทรง บวกลบในชีวิตประจำวัน", c: "leaf", s: "กำลังพัฒนา" },
              { t: "Science", th: "วิทยาศาสตร์", d: "สังเกตธรรมชาติรอบบ้านอย่างปลอดภัย", c: "muted", s: "เร็ว ๆ นี้" },
              { t: "Thinking", th: "การคิด", d: "ปริศนา จัดกลุ่ม และเหตุผล", c: "muted", s: "เร็ว ๆ นี้" },
              { t: "Life Skills", th: "ทักษะชีวิต", d: "ความรู้สึก การช่วยงานบ้าน และน้ำใจ", c: "muted", s: "เร็ว ๆ นี้" },
            ].map((w, i) => (
              <article key={w.t} className={`world world--${w.c}`} data-reveal data-delay={String((i % 3) + 1)}>
                <span className={`chip ${w.s === "เล่นได้แล้ว" ? "chip--leaf" : "chip--soon"}`}>{w.s}</span>
                <h3>{w.t}</h3>
                <p className="world__th">{w.th}</p>
                <p>{w.d}</p>
              </article>
            ))}
          </div>
          <div className="center" data-reveal><a className="btn btn--ghost" href="#english">ดูบทเรียนภาษาอังกฤษ</a></div>
        </div>
      </section>

      {/* 08 — English Together spotlight */}
      <section id="english" className="section spot" aria-labelledby="english-title">
        <div className="container spot__grid">
          <div className="spot__copy" data-reveal>
            <p className="kicker">English Together</p>
            <h2 id="english-title">พ่อแม่ไม่เก่งอังกฤษ<br />ก็ชวนลูกพูดได้</h2>
            <p>ทุกคำมีเสียง คำอ่านภาษาไทย และความหมาย พร้อมประโยคสั้น ๆ ให้พ่อแม่พูดตาม — เรียนไปพร้อมกับลูกแบบไม่ต้องเขิน</p>
            <ul className="ticks">
              <li>ฟังซ้ำได้ไม่จำกัด ไม่ต้องอัดเสียง ไม่ใช้ไมโครโฟน</li>
              <li>คำศัพท์จากของรอบตัว: สี สัตว์ อาหาร บ้าน ครอบครัว</li>
              <li>ทุกคำต่อยอดเป็นภารกิจนอกจอ เช่น “Find something red”</li>
            </ul>
          </div>
          <div data-reveal data-delay="1"><EnglishSpotlight /></div>
        </div>
      </section>

      {/* 09 — together moments */}
      <section className="section section--tint" aria-labelledby="together-title">
        <div className="container">
          <SectionHead id="together-title" kicker="Together moments" title="ช่วงเวลาเล็ก ๆ ที่มีอยู่แล้วในทุกบ้าน" sub="ภารกิจใช้ของที่มีในบ้าน ไม่ต้องถ่ายรูปหรือโพสต์ — แค่เล่นด้วยกันจริง ๆ" />
          <div className="moments">
            {[
              { when: "ก่อนมื้อเย็น", t: "นับช้อนจัดโต๊ะ", d: "ลูกนับช้อนและแก้วให้ครบทุกคน ฝึกนับ 1–10 แบบได้ช่วยงานบ้าน", c: "peach" },
              { when: "เดินเล่นตอนเย็น", t: "เดินเล่นตามล่าสี", d: "ผลัดกันชี้ของรอบตัวแล้วบอกสีเป็นภาษาอังกฤษ “I see something green!”", c: "leaf" },
              { when: "ก่อนนอน", t: "หน้าบอกความรู้สึก", d: "ทำหน้าบอกความรู้สึกวันนี้ แล้วแชร์เรื่องดี ๆ คนละหนึ่งเรื่อง", c: "blue" },
            ].map((m, i) => (
              <article key={m.t} className={`moment moment--${m.c}`} data-reveal data-delay={String(i + 1)}>
                <span className="moment__when">{m.when}</span>
                <h3>{m.t}</h3>
                <p>{m.d}</p>
              </article>
            ))}
          </div>
          <div className="center" data-reveal><a className="btn btn--ghost" href="#planner">รับไอเดียกิจกรรม</a></div>
        </div>
      </section>

      {/* 09b — Little ones library (ages 1–3) */}
      <section id="little" className="section little" aria-labelledby="little-title">
        <div className="container little__grid">
          <div className="little__copy" data-reveal>
            <p className="kicker">สำหรับวัย 1–3 ปี</p>
            <h2 id="little-title">ใบงานพิมพ์ได้<br />และนิทานสองภาษา</h2>
            <p>วัยเล็กควรเล่นนอกจอกับผู้ใหญ่ Growlilo จึงทำคลังที่ “ใช้จอให้น้อยที่สุด” — พิมพ์ใบงานไปทำบนโต๊ะ อ่านนิทานให้ลูกฟัง หรือเปิดเสียงอ่านแล้วพักหน้าจอไว้</p>
            <ul className="ticks">
              <li>ใบงาน {ALL_WORKSHEETS.length - 2}+ แผ่น: จุ่มนิ้วแต้มสี ลากเส้น จับคู่เงา นับ 1–3 ใหญ่-เล็ก</li>
              <li>นิทานต้นฉบับ {ALL_STORIES.length - 1}+ เรื่อง อ่านได้ทั้งไทยและอังกฤษ พร้อมเสียงอ่าน</li>
              <li>โหมดฟังอย่างเดียว (จอมืด) และตั้งเวลาปิดเสียง ใช้ได้ฟรี</li>
              <li>มีใบงานและนิทานใหม่ทุกเดือน</li>
            </ul>
            <div className="little__ctas">
              <Link className="btn btn--lg" href="/app/library/">เปิดห้องสมุดฟรี</Link>
              <a className="btn btn--lg btn--ghost" href="#pricing">ดูว่า Plus มีอะไรเพิ่ม</a>
            </div>
          </div>
          <div className="little__art" data-reveal data-delay="1">
            <div className="little__sheet" aria-hidden><WorksheetSheet ws={getWorksheet("ws-trace-car-home")!} /></div>
            <div className="little__story" aria-hidden>
              <Scene scene={getStory("story-lilo-goodnight")!.pages[5].scene} />
              <p className="little__th">กรุ๊วกอดลิโล่แน่น ๆ “ราตรีสวัสดิ์นะ ลูกรัก”</p>
              <p className="little__en" lang="en">Grow gives Lilo a big hug. “Goodnight, my love.”</p>
            </div>
          </div>
        </div>
      </section>

      {/* 10 — parent dashboard preview */}
      <section id="parents" className="section" aria-labelledby="parents-title">
        <div className="container dash-prev">
          <div className="dash-prev__copy" data-reveal>
            <p className="kicker">สำหรับพ่อแม่</p>
            <h2 id="parents-title">เห็นการเรียนรู้<br />โดยไม่ต้องจับผิด</h2>
            <p>สรุปรายสัปดาห์ที่อ่านเข้าใจใน 10 วินาที — ลูกได้ลองอะไร ภารกิจไหนทำด้วยกันแล้ว และควรลองอะไรต่อ ตั้งเวลาหน้าจอได้เองทุกแพ็ก</p>
            <ul className="ticks">
              <li>ไม่มีการเปรียบเทียบกับเด็กคนอื่น ไม่มีกระดานอันดับ</li>
              <li>ป้ายผลแบบอ่อนโยน: “กำลังฝึก / ทำได้ในกิจกรรมนี้ / ลองอีกครั้ง”</li>
              <li>ไม่ใช่การประเมินพัฒนาการหรือวินิจฉัยทางการแพทย์</li>
            </ul>
            <Link className="btn" href="/app/welcome/">ดูระบบผู้ปกครอง</Link>
          </div>
          <div className="dash-mock" data-reveal data-delay="1" role="img" aria-label="ภาพตัวอย่างแดชบอร์ดผู้ปกครอง ข้อมูลสาธิต">
            <div className="dash-mock__bar"><span /><span /><span /><em>ตัวอย่างหน้าจอ • ข้อมูลสาธิต</em></div>
            <div className="dash-mock__body">
              <p className="dash-mock__hi">สัปดาห์นี้ของ “น้องต้นกล้า”</p>
              <div className="dash-mock__stats">
                <div><b>3</b><span>เกมที่เล่น</span></div>
                <div><b>2</b><span>ภารกิจด้วยกัน</span></div>
                <div><b>14</b><span>นาทีบนจอ</span></div>
              </div>
              <div className="dash-mock__row"><span>คำศัพท์สี (อังกฤษ)</span><span className="chip chip--leaf">ทำได้ในกิจกรรมนี้</span></div>
              <div className="dash-mock__row"><span>ฟังคำภาษาอังกฤษ</span><span className="chip chip--blue">กำลังฝึก</span></div>
              <div className="dash-mock__next"><b>ลองต่อ:</b> เดินเล่นตามล่าสี — ฝึกสีอื่นนอกบ้าน</div>
            </div>
          </div>
        </div>
      </section>

      {/* 11 — pricing */}
      <section id="pricing" className="section section--tint" aria-labelledby="pricing-title">
        <div className="container">
          <SectionHead id="pricing-title" kicker="แพ็กครอบครัว" title="เริ่มฟรี แล้วค่อยตัดสินใจ" sub="ไม่มีโฆษณา ไม่มีการซื้อในโหมดเด็ก และการตั้งเวลาหน้าจอฟรีเสมอ" />
          <div data-reveal><Pricing /></div>
        </div>
      </section>

      {/* 12 — trust & privacy */}
      <section className="section trust" aria-labelledby="trust-title">
        <div className="container">
          <SectionHead id="trust-title" kicker="ความปลอดภัยและความเป็นส่วนตัว" title="พื้นที่ของลูกต้องปลอดภัยตั้งแต่วันแรก" />
          <ul className="trust__grid">
            {[
              { t: "ไม่มีโฆษณาสำหรับเด็ก", d: "ไม่มีแบนเนอร์ ไม่มีลิงก์ออกนอกแอปในโหมดเด็ก" },
              { t: "พ่อแม่ควบคุมการซื้อ", d: "การชำระเงินและการตั้งค่าอยู่หลังประตูผู้ปกครองเท่านั้น" },
              { t: "ไม่มีแชทเปิด", d: "ไม่มีแชท ไม่มีฟีดโซเชียล ไม่มีกระดานอันดับสาธารณะ" },
              { t: "เก็บข้อมูลเท่าที่จำเป็น", d: "ไม่ขอชื่อจริง วันเกิด รูป ไมค์ หรือตำแหน่ง ลบ/ส่งออกได้เอง" },
              { t: "ไม่ล่อให้เล่นนาน", d: "ไม่มี streak ไม่มีด่านต่ออัตโนมัติ ไม่มีของรางวัลสุ่ม" },
              { t: "ไม่มีตัวติดตาม", d: "ไม่ใช้พิกเซลโฆษณาหรือ tracker ของบุคคลที่สาม" },
            ].map((x, i) => (
              <li key={x.t} data-reveal data-delay={String((i % 3) + 1)}>
                <span className="trust__ic" aria-hidden>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /><path d="M9 12l2 2 4-4" /></svg>
                </span>
                <div><h3>{x.t}</h3><p>{x.d}</p></div>
              </li>
            ))}
          </ul>
          <div className="center" data-reveal><Link className="btn btn--ghost" href="/privacy/">อ่านนโยบายความเป็นส่วนตัว</Link></div>
        </div>
      </section>

      {/* 13 — FAQ */}
      <section id="faq" className="section section--tint" aria-labelledby="faq-title">
        <div className="container faq-wrap">
          <SectionHead id="faq-title" kicker="FAQ" title="คำถามที่พ่อแม่ถามบ่อย" />
          <div data-reveal><Faq /></div>
          <div className="center" data-reveal><Link className="btn" href="/app/welcome/">ลองเล่นฟรี</Link></div>
        </div>
      </section>

      {/* 14 — final CTA */}
      <section className="final" aria-labelledby="final-title">
        <div className="container final__inner" data-reveal>
          <Grow size={130} className="final__grow anim-float" />
          <div className="final__copy">
            <h2 id="final-title">วันนี้เริ่มก้าวเล็ก ๆ ด้วยกัน</h2>
            <p>วันนี้ไม่รู้จะเล่นอะไรกับลูก? เริ่มด้วยก้าวเล็ก ๆ ที่ Growlilo</p>
            <Link className="btn btn--lg btn--light" href="/app/welcome/">เริ่มเล่นฟรี <span className="arrow" aria-hidden>→</span></Link>
          </div>
          <Lilo size={110} wave className="final__lilo anim-float" style={{ animationDelay: "-2s" }} />
        </div>
      </section>

      {/* Sticky mobile CTA — marketing only */}
      <div className="sticky-cta">
        <Link className="btn btn--block" href="/app/welcome/">ลองกิจกรรมฟรี</Link>
      </div>
    </>
  );
}
