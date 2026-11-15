"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { generatePlan, type AgeBand, type PlanTopic, type Place } from "@growlilo/game-core";
import { LESSONS, MISSIONS, PROMPTS } from "@/lib/content";

const AGES: Array<{ v: AgeBand; label: string }> = [
  { v: "2-3", label: "2–3 ปี" }, { v: "4-5", label: "4–5 ปี" }, { v: "6-8", label: "6–8 ปี" }, { v: "9-12", label: "9–12 ปี" },
];
const TIMES = [10, 15, 20, 30];
const TOPICS: Array<{ v: PlanTopic; label: string }> = [
  { v: "english", label: "ภาษาอังกฤษ" }, { v: "thai", label: "ภาษาไทย" }, { v: "math", label: "คณิต" }, { v: "mix", label: "ผสม" },
];
const PLACES: Array<{ v: Place; label: string }> = [{ v: "indoor", label: "ในบ้าน" }, { v: "outdoor", label: "นอกบ้าน" }];

function Seg<T extends string | number>({ legend, name, options, value, onChange }: {
  legend: string; name: string; options: Array<{ v: T; label: string }>; value: T; onChange: (v: T) => void;
}) {
  return (
    <fieldset className="seg">
      <legend>{legend}</legend>
      <div className="seg__row">
        {options.map((o) => (
          <label key={String(o.v)} className={`seg__opt ${o.v === value ? "is-on" : ""}`}>
            <input type="radio" name={name} value={String(o.v)} checked={o.v === value} onChange={() => onChange(o.v)} />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const SEG_META = {
  screen: { label: "เกมบนจอ", cls: "tl--screen" },
  mission: { label: "ภารกิจนอกจอ", cls: "tl--mission" },
  talk: { label: "คุยกันสั้น ๆ", cls: "tl--talk" },
} as const;

export function PlannerTeaser() {
  const [age, setAge] = useState<AgeBand>("4-5");
  const [time, setTime] = useState(15);
  const [topic, setTopic] = useState<PlanTopic>("english");
  const [place, setPlace] = useState<Place>("indoor");
  const plan = useMemo(() => generatePlan({ ageBand: age, totalMinutes: time, topic, place }, LESSONS, MISSIONS, PROMPTS), [age, time, topic, place]);

  return (
    <div className="planner">
      <form className="planner__form" onSubmit={(e) => e.preventDefault()} aria-label="ตัวเลือกแผนกิจกรรม">
        <Seg legend="อายุลูก" name="age" options={AGES} value={age} onChange={setAge} />
        <Seg legend="มีเวลาทั้งหมด" name="time" options={TIMES.map((t) => ({ v: t, label: `${t} นาที` }))} value={time} onChange={setTime} />
        <Seg legend="อยากฝึกเรื่อง" name="topic" options={TOPICS} value={topic} onChange={setTopic} />
        <Seg legend="เล่นที่ไหน" name="place" options={PLACES} value={place} onChange={setPlace} />
      </form>
      <div className="planner__out" aria-live="polite">
        <div className="planner__head">
          <span className="chip chip--peach">ตัวอย่างแผน</span>
          {plan.kind !== "roadmap" && <span className="planner__total">{plan.totalMinutes} นาที</span>}
        </div>
        {plan.kind === "roadmap" ? (
          <div className="planner__note" data-testid="plan-roadmap">
            {plan.notes.map((n) => <p key={n}>{n}</p>)}
          </div>
        ) : (
          <>
            {plan.kind === "parent_assisted" && (
              <div className="planner__warn" role="note" data-testid="plan-toddler">
                <b>สำหรับวัย 2–3 ปี</b> — เน้นเล่นนอกจอร่วมกับผู้ใหญ่ ไม่จัดเวลาหน้าจอให้อัตโนมัติ
              </div>
            )}
            <div className="tl-bar" aria-hidden>
              {plan.segments.map((s, i) => (
                <span key={i} className={SEG_META[s.type].cls} style={{ flexGrow: s.minutes }} />
              ))}
            </div>
            <ol className="tl" data-testid="plan-segments">
              {plan.segments.map((s, i) => (
                <li key={i} className={SEG_META[s.type].cls}>
                  <span className="tl__min">{s.minutes}<small>นาที</small></span>
                  <div>
                    <b>{SEG_META[s.type].label}</b>
                    <p>{s.type === "screen" ? s.title : s.type === "mission" ? `${s.title} — ${s.instruction}` : s.prompt}</p>
                  </div>
                </li>
              ))}
            </ol>
            <ul className="planner__notes">
              {plan.notes.map((n) => <li key={n}>{n}</li>)}
            </ul>
          </>
        )}
        <Link className="btn btn--block" href="/app/welcome/">ทดลองแผนกิจกรรมนี้กับลูก</Link>
      </div>
    </div>
  );
}
