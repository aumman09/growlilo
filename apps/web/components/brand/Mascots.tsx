/* Original Growlilo mascots drawn for this repository (see assets/LICENSES.md). */
import type { CSSProperties } from "react";

type Expr = "happy" | "wow" | "calm";

function Face({ cx, cy, expr, scale = 1 }: { cx: number; cy: number; expr: Expr; scale?: number }) {
  const e = 18 * scale;
  return (
    <g>
      {expr === "calm" ? (
        <>
          <path d={`M${cx - e - 5} ${cy} q5 5 10 0`} stroke="#26382F" strokeWidth={3.2} fill="none" strokeLinecap="round" />
          <path d={`M${cx + e - 5} ${cy} q5 5 10 0`} stroke="#26382F" strokeWidth={3.2} fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx={cx - e} cy={cy} rx={4.6 * scale} ry={5.6 * scale} fill="#26382F" />
          <ellipse cx={cx + e} cy={cy} rx={4.6 * scale} ry={5.6 * scale} fill="#26382F" />
          <circle cx={cx - e + 1.6} cy={cy - 2} r={1.6 * scale} fill="#fff" />
          <circle cx={cx + e + 1.6} cy={cy - 2} r={1.6 * scale} fill="#fff" />
        </>
      )}
      <ellipse cx={cx - e - 9} cy={cy + 12} rx={7 * scale} ry={4.5 * scale} fill="#F7A363" opacity={0.55} />
      <ellipse cx={cx + e + 9} cy={cy + 12} rx={7 * scale} ry={4.5 * scale} fill="#F7A363" opacity={0.55} />
      {expr === "wow" ? (
        <ellipse cx={cx} cy={cy + 15} rx={5 * scale} ry={6 * scale} fill="#7a2e1f" />
      ) : (
        <path d={`M${cx - 9 * scale} ${cy + 11} q${9 * scale} ${10 * scale} ${18 * scale} 0`} stroke="#26382F" strokeWidth={3.2} fill="none" strokeLinecap="round" />
      )}
    </g>
  );
}

/** Lilo — the sprout child mascot. */
export function Lilo({ size = 160, expr = "happy", wave = false, className, style, title }: {
  size?: number; expr?: Expr; wave?: boolean; className?: string; style?: CSSProperties; title?: string;
}) {
  const id = "lilo";
  return (
    <svg viewBox="0 0 160 180" width={size} height={(size * 180) / 160} className={className} style={style}
      role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <defs>
        <radialGradient id={`${id}-body`} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#C9E6B4" />
          <stop offset="0.6" stopColor="#9CCB86" />
          <stop offset="1" stopColor="#7CB66B" />
        </radialGradient>
        <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8FCB72" />
          <stop offset="1" stopColor="#357553" />
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="172" rx="46" ry="6" fill="#234B37" opacity="0.10" />
      <g className="anim-sway" style={{ transformBox: "fill-box" }}>
        <path d="M80 62 C80 50 80 42 81 30" stroke="#357553" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M81 34 C62 14 36 18 30 30 C46 44 68 44 81 34Z" fill={`url(#${id}-leaf)`} />
        <path d="M81 32 C96 8 124 8 132 20 C118 38 96 42 81 32Z" fill="#7CB66B" />
        <path d="M81 33 C100 22 116 18 128 20" stroke="#E3F1D9" strokeWidth="2" fill="none" opacity=".7" strokeLinecap="round" />
      </g>
      <ellipse cx="54" cy="160" rx="14" ry="8" fill="#5E9C52" />
      <ellipse cx="106" cy="160" rx="14" ry="8" fill="#5E9C52" />
      <path d="M80 56 C122 56 142 88 142 116 C142 146 116 164 80 164 C44 164 18 146 18 116 C18 88 38 56 80 56Z" fill={`url(#${id}-body)`} />
      <ellipse cx="80" cy="132" rx="38" ry="28" fill="#FFF9EE" opacity="0.55" />
      <ellipse cx="22" cy="122" rx="9" ry="14" fill="#8EC47A" transform="rotate(18 22 122)" />
      {wave ? (
        <ellipse cx="140" cy="94" rx="9" ry="15" fill="#8EC47A" transform="rotate(-30 140 94)" />
      ) : (
        <ellipse cx="138" cy="122" rx="9" ry="14" fill="#8EC47A" transform="rotate(-18 138 122)" />
      )}
      <Face cx={80} cy={104} expr={expr} />
    </svg>
  );
}

/** Grow — the warm parent companion. */
export function Grow({ size = 180, expr = "happy", className, style }: { size?: number; expr?: Expr; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 170 240" width={size} height={(size * 240) / 170} className={className} style={style} aria-hidden>
      <defs>
        <radialGradient id="grow-body" cx="38%" cy="28%" r="80%">
          <stop offset="0" stopColor="#FFD6B0" />
          <stop offset="0.65" stopColor="#FBB47C" />
          <stop offset="1" stopColor="#F29A55" />
        </radialGradient>
      </defs>
      <ellipse cx="85" cy="232" rx="52" ry="7" fill="#234B37" opacity="0.10" />
      <path d="M86 46 C86 34 87 26 90 16" stroke="#357553" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M90 20 C106 -2 140 2 146 16 C128 32 104 32 90 20Z" fill="#357553" />
      <path d="M92 19 C110 10 126 8 140 12" stroke="#B9DCA6" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="60" cy="224" rx="16" ry="9" fill="#D9803F" />
      <ellipse cx="112" cy="224" rx="16" ry="9" fill="#D9803F" />
      <path d="M85 40 C130 40 152 76 152 130 C152 188 126 226 85 226 C44 226 18 188 18 130 C18 76 40 40 85 40Z" fill="url(#grow-body)" />
      <path d="M85 150 C112 150 128 166 128 190 C128 206 110 220 85 220 C60 220 42 206 42 190 C42 166 58 150 85 150Z" fill="#FFF9EE" opacity="0.5" />
      <ellipse cx="22" cy="140" rx="10" ry="20" fill="#F6A766" transform="rotate(14 22 140)" />
      <ellipse cx="148" cy="140" rx="10" ry="20" fill="#F6A766" transform="rotate(-14 148 140)" />
      <Face cx={85} cy={100} expr={expr} scale={1.1} />
    </svg>
  );
}

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <rect width="64" height="64" rx="20" fill="#234B37" />
      <path d="M32 46 C32 38 32 32 33 24" stroke="#FFF9EE" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M33 28 C24 16 12 18 10 25 C18 32 28 32 33 28Z" fill="#7CB66B" />
      <path d="M33 26 C40 12 54 12 56 20 C50 30 40 32 33 26Z" fill="#9ED4F2" />
      <circle cx="32" cy="50" r="5" fill="#F7A363" />
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="logo" style={{ color: light ? "var(--cream-50)" : "var(--forest-900)" }}>
      <LogoMark />
      <span className="logo__word">growlilo<span style={{ color: "var(--peach-400)" }}>.</span></span>
    </span>
  );
}
