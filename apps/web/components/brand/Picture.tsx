/* Original line-art pictures for worksheets & stories (see assets/LICENSES.md). */
import type { PictureKind } from "@growlilo/game-core";

export type PictureMode = "fill" | "outline" | "shadow";

const INK = "#26382F";
const COLORS: Record<PictureKind, string> = {
  balloon: "#E2483D", fish: "#2F6FD6", star: "#F5C518", car: "#3A9B4C", ball: "#F28A1F", flower: "#E98BA4",
  apple: "#E2483D", duck: "#F5C518", sun: "#F7A363", cloud: "#FFFFFF", house: "#F7A363", heart: "#E2483D",
  cat: "#B9A58A", tree: "#3A9B4C", moon: "#F5C518", banana: "#F5C518",
};

export const PICTURE_TH: Record<PictureKind, string> = {
  balloon: "ลูกโป่ง", fish: "ปลา", star: "ดาว", car: "รถ", ball: "ลูกบอล", flower: "ดอกไม้", apple: "แอปเปิล", duck: "เป็ด",
  sun: "ดวงอาทิตย์", cloud: "เมฆ", house: "บ้าน", heart: "หัวใจ", cat: "แมว", tree: "ต้นไม้", moon: "พระจันทร์", banana: "กล้วย",
};

/** Renders inside a parent <svg> (as <g>) or standalone. */
export function PictureG({ kind, mode = "fill", x = 0, y = 0, size = 120, color }: {
  kind: PictureKind; mode?: PictureMode; x?: number; y?: number; size?: number; color?: string;
}) {
  const F = mode === "outline" ? "#FFFFFF" : mode === "shadow" ? INK : color ?? COLORS[kind];
  const S = mode === "fill" ? "rgba(38,56,47,.18)" : INK;
  const sw = mode === "outline" ? 3.5 : 2;
  const det = mode !== "shadow"; // facial/detail lines
  const D = mode === "fill" ? "#26382F" : INK;
  const common = { fill: F, stroke: S, strokeWidth: sw, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  let body: React.ReactNode;
  switch (kind) {
    case "balloon":
      body = (<><path d="M60 98 C57 106 64 112 59 120" stroke={INK} strokeWidth={2} fill="none" /><ellipse cx="60" cy="52" rx="33" ry="40" {...common} /><path d="M54 92 L66 92 L60 100Z" {...common} /></>);
      break;
    case "fish":
      body = (<><path d="M88 60 L114 40 L110 60 L114 80Z" {...common} /><ellipse cx="56" cy="60" rx="40" ry="27" {...common} />{det && <><circle cx="34" cy="54" r="5" fill={D} /><path d="M58 42 q10 18 0 36" stroke={D} strokeWidth={2.5} fill="none" opacity=".5" /></>}</>);
      break;
    case "star":
      body = (<><path d="M60 8 L74 42 L112 44 L83 68 L93 106 L60 85 L27 106 L37 68 L8 44 L46 42Z" {...common} />{det && <><circle cx="50" cy="58" r="3.5" fill={D} /><circle cx="70" cy="58" r="3.5" fill={D} /><path d="M53 68 q7 6 14 0" stroke={D} strokeWidth={2.5} fill="none" strokeLinecap="round" /></>}</>);
      break;
    case "car":
      body = (<><path d="M12 80 L12 62 Q14 54 24 52 L36 32 Q40 28 48 28 L76 28 Q84 28 88 34 L98 52 Q108 54 108 64 L108 80Z" {...common} />{det && <path d="M44 36 L76 36 L84 52 L36 52Z" fill={mode === "fill" ? "#E2F2FB" : "#fff"} stroke={INK} strokeWidth={sw * 0.8} strokeLinejoin="round" />}<circle cx="36" cy="82" r="13" fill={INK} /><circle cx="88" cy="82" r="13" fill={INK} /></>);
      break;
    case "ball":
      body = (<><circle cx="60" cy="60" r="46" {...common} />{det && <><path d="M16 52 Q60 74 104 52" stroke={mode === "fill" ? "#fff" : INK} strokeWidth={3} fill="none" /><path d="M60 14 Q42 60 60 106" stroke={mode === "fill" ? "#fff" : INK} strokeWidth={3} fill="none" /></>}</>);
      break;
    case "flower":
      body = (<><path d="M60 70 L60 116" stroke={mode === "shadow" ? INK : "#3A9B4C"} strokeWidth={5} />{[0, 72, 144, 216, 288].map((r) => <ellipse key={r} cx="60" cy="28" rx="15" ry="21" transform={`rotate(${r} 60 50)`} {...common} />)}<circle cx="60" cy="50" r="13" {...common} fill={mode === "fill" ? "#FFF3C4" : F} /></>);
      break;
    case "apple":
      body = (<><path d="M60 34 C42 20 14 30 16 62 C18 94 42 112 60 102 C78 112 102 94 104 62 C106 30 78 20 60 34Z" {...common} /><path d="M60 34 C60 24 62 16 66 10" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" /><path d="M66 18 C76 8 90 12 92 18 C84 26 72 26 66 18Z" {...common} fill={mode === "fill" ? "#3A9B4C" : F} /></>);
      break;
    case "duck":
      body = (<><path d="M20 76 C20 96 40 106 64 106 C90 106 108 94 108 74 C108 64 98 60 88 66 C80 70 70 70 62 64 L20 64Z" {...common} /><circle cx="42" cy="46" r="20" {...common} /><path d="M20 44 L4 50 L20 56Z" {...common} fill={mode === "fill" ? "#F28A1F" : F} />{det && <circle cx="38" cy="42" r="3.5" fill={D} />}</>);
      break;
    case "sun":
      body = (<>{[0, 45, 90, 135, 180, 225, 270, 315].map((r) => <rect key={r} x="55" y="4" width="10" height="20" rx="5" transform={`rotate(${r} 60 60)`} {...common} />)}<circle cx="60" cy="60" r="30" {...common} />{det && <><circle cx="50" cy="56" r="3.5" fill={D} /><circle cx="70" cy="56" r="3.5" fill={D} /><path d="M50 68 q10 9 20 0" stroke={D} strokeWidth={3} fill="none" strokeLinecap="round" /></>}</>);
      break;
    case "cloud":
      body = (<path d="M28 88 C10 88 6 66 22 60 C18 40 42 30 54 42 C60 24 92 24 94 48 C112 48 116 74 100 88Z" {...common} fill={mode === "fill" ? "#FFFFFF" : F} stroke={mode === "fill" ? "#9ED4F2" : S} strokeWidth={mode === "fill" ? 4 : sw} />);
      break;
    case "house":
      body = (<><path d="M22 58 L22 108 L98 108 L98 58Z" {...common} /><path d="M10 60 L60 16 L110 60Z" {...common} fill={mode === "fill" ? "#B44337" : F} />{det && <><rect x="50" y="76" width="20" height="32" rx="3" fill={mode === "fill" ? "#7A4A2A" : "#fff"} stroke={INK} strokeWidth={sw * 0.8} /><rect x="30" y="68" width="14" height="14" fill={mode === "fill" ? "#E2F2FB" : "#fff"} stroke={INK} strokeWidth={sw * 0.8} /><rect x="76" y="68" width="14" height="14" fill={mode === "fill" ? "#E2F2FB" : "#fff"} stroke={INK} strokeWidth={sw * 0.8} /></>}</>);
      break;
    case "heart":
      body = (<path d="M60 104 C24 80 8 60 10 40 C12 20 38 12 60 34 C82 12 108 20 110 40 C112 60 96 80 60 104Z" {...common} />);
      break;
    case "cat":
      body = (<><path d="M22 34 L30 8 L48 26Z" {...common} /><path d="M98 34 L90 8 L72 26Z" {...common} /><ellipse cx="60" cy="58" rx="42" ry="36" {...common} />{det && <><circle cx="46" cy="54" r="4" fill={D} /><circle cx="74" cy="54" r="4" fill={D} /><path d="M56 66 L64 66 L60 71Z" fill={mode === "fill" ? "#E98BA4" : D} /><path d="M60 71 q-6 7 -12 3 M60 71 q6 7 12 3" stroke={D} strokeWidth={2.5} fill="none" /><path d="M36 66 L14 62 M36 70 L14 74 M84 66 L106 62 M84 70 L106 74" stroke={D} strokeWidth={2} /></>}</>);
      break;
    case "tree":
      body = (<><rect x="50" y="70" width="20" height="44" rx="4" {...common} fill={mode === "fill" ? "#8B5E3C" : F} /><path d="M60 8 C84 8 100 24 98 42 C112 50 108 76 88 78 L32 78 C12 76 8 50 22 42 C20 24 36 8 60 8Z" {...common} /></>);
      break;
    case "moon":
      body = (<><path d="M76 10 A50 50 0 1 0 108 84 A40 40 0 1 1 76 10Z" {...common} />{det && <><circle cx="44" cy="58" r="3.5" fill={D} /><path d="M40 74 q8 6 16 0" stroke={D} strokeWidth={3} fill="none" strokeLinecap="round" /></>}</>);
      break;
    case "banana":
      body = (<><path d="M14 40 C20 84 60 108 104 88 C108 86 108 80 104 78 C70 88 40 72 30 34 C28 28 14 30 14 40Z" {...common} /><path d="M14 40 L10 30 L22 30Z" fill={INK} /></>);
      break;
  }
  const s = size / 120;
  return <g transform={`translate(${x} ${y}) scale(${s})`}>{body}</g>;
}

export function Picture({ kind, mode = "fill", size = 96, label }: { kind: PictureKind; mode?: PictureMode; size?: number; label?: string }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <PictureG kind={kind} mode={mode} />
    </svg>
  );
}
