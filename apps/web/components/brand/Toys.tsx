import type { ColorId, ObjectKind } from "@growlilo/game-core";

export const TOY_HEX: Record<ColorId, string> = {
  red: "#E2483D", blue: "#2F6FD6", yellow: "#F5C518", green: "#3A9B4C", orange: "#F28A1F", purple: "#8A4FC4",
};
export const COLOR_TH: Record<ColorId, string> = {
  red: "สีแดง", blue: "สีน้ำเงิน", yellow: "สีเหลือง", green: "สีเขียว", orange: "สีส้ม", purple: "สีม่วง",
};

/** Simple, unambiguous objects: every choice in a round is the SAME object, only the colour differs. */
export function Toy({ kind, color, size = 120 }: { kind: ObjectKind; color: ColorId; size?: number }) {
  const c = TOY_HEX[color];
  const shine = <ellipse cx="40" cy="36" rx="9" ry="6" fill="#fff" opacity=".45" transform="rotate(-30 40 36)" />;
  let body: React.ReactNode;
  switch (kind) {
    case "balloon":
      body = (<>
        <path d="M60 104 C58 112 64 116 60 124" stroke="#69786E" strokeWidth="2" fill="none" />
        <ellipse cx="60" cy="56" rx="34" ry="42" fill={c} />
        <path d="M54 97 L66 97 L60 105Z" fill={c} />
        {shine}
      </>);
      break;
    case "fish":
      body = (<>
        <path d="M86 60 L112 40 L108 60 L112 80Z" fill={c} />
        <ellipse cx="56" cy="60" rx="40" ry="28" fill={c} />
        <circle cx="34" cy="54" r="6" fill="#fff" /><circle cx="33" cy="54" r="3" fill="#26382F" />
        <path d="M52 44 q10 16 0 32" stroke="#fff" strokeWidth="3" fill="none" opacity=".5" />
      </>);
      break;
    case "star":
      body = (<>
        <path d="M60 10 L74 44 L110 46 L82 69 L92 104 L60 84 L28 104 L38 69 L10 46 L46 44Z" fill={c} stroke="#00000014" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="50" cy="58" r="3.5" fill="#26382F" /><circle cx="70" cy="58" r="3.5" fill="#26382F" />
        <path d="M53 68 q7 6 14 0" stroke="#26382F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </>);
      break;
    case "car":
      body = (<>
        <path d="M14 76 L14 60 Q16 52 26 50 L38 32 Q42 28 50 28 L76 28 Q84 28 88 34 L98 50 Q108 52 108 62 L108 76Z" fill={c} />
        <path d="M44 34 L76 34 Q80 34 82 38 L88 50 L36 50Z" fill="#E2F2FB" />
        <line x1="60" y1="34" x2="60" y2="50" stroke={c} strokeWidth="4" />
        <circle cx="36" cy="80" r="13" fill="#26382F" /><circle cx="36" cy="80" r="5" fill="#ECE3D0" />
        <circle cx="88" cy="80" r="13" fill="#26382F" /><circle cx="88" cy="80" r="5" fill="#ECE3D0" />
      </>);
      break;
    case "ball":
      body = (<>
        <circle cx="60" cy="60" r="44" fill={c} />
        <path d="M18 52 Q60 72 102 52" stroke="#fff" strokeWidth="5" fill="none" opacity=".75" />
        <path d="M60 16 Q44 60 60 104" stroke="#fff" strokeWidth="5" fill="none" opacity=".75" />
        {shine}
      </>);
      break;
    case "flower":
      body = (<>
        <path d="M60 70 L60 114" stroke="#3A9B4C" strokeWidth="5" />
        <path d="M60 100 Q78 88 86 96 Q74 108 60 100Z" fill="#3A9B4C" />
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse key={r} cx="60" cy="30" rx="16" ry="22" fill={c} transform={`rotate(${r} 60 52)`} />
        ))}
        <circle cx="60" cy="52" r="13" fill="#FFF3C4" />
      </>);
      break;
  }
  return (
    <svg viewBox="0 0 120 124" width={size} height={size} aria-hidden>
      {body}
    </svg>
  );
}

export function AvatarIcon({ id, size = 56 }: { id: string; size?: number }) {
  const inner: Record<string, React.ReactNode> = {
    sprout: (<><path d="M32 46 V28" stroke="#357553" strokeWidth="4" strokeLinecap="round" /><path d="M32 30 C22 18 12 22 12 28 C20 34 28 34 32 30Z" fill="#357553" /><path d="M32 28 C40 14 52 16 52 22 C46 30 38 32 32 28Z" fill="#7CB66B" /></>),
    sun: (<><circle cx="32" cy="32" r="12" fill="#F7A363" />{[0, 45, 90, 135, 180, 225, 270, 315].map((r) => <rect key={r} x="30.5" y="8" width="3" height="8" rx="1.5" fill="#F7A363" transform={`rotate(${r} 32 32)`} />)}</>),
    cloud: (<path d="M18 40 a9 9 0 0 1 2-17 a12 12 0 0 1 23-2 a9 9 0 0 1 3 19Z" fill="#fff" stroke="#9ED4F2" strokeWidth="3" />),
    bloom: (<>{[0, 72, 144, 216, 288].map((r) => <ellipse key={r} cx="32" cy="20" rx="7" ry="10" fill="#E98BA4" transform={`rotate(${r} 32 32)`} />)}<circle cx="32" cy="32" r="7" fill="#FFF3C4" /></>),
    pebble: (<><ellipse cx="32" cy="36" rx="18" ry="13" fill="#B9A58A" /><ellipse cx="26" cy="32" rx="5" ry="3" fill="#fff" opacity=".4" /></>),
    moon: (<path d="M40 14 a18 18 0 1 0 10 30 a14 14 0 1 1 -10 -30Z" fill="#B7A6E0" />),
  };
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <circle cx="32" cy="32" r="31" fill="#FFF9EE" />
      {inner[id] ?? inner.sprout}
    </svg>
  );
}
