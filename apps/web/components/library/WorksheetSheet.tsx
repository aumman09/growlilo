/* A4 printable worksheet. All layout is data-driven by `worksheet.template`. */
import "@/styles/library-shared.css";
import type { PictureKind, Worksheet, WorksheetTemplate } from "@growlilo/game-core";
import { PictureG } from "@/components/brand/Picture";
import { LogoMark } from "@/components/brand/Mascots";

const W = 700;
const H = 760;
const INK = "#26382F";
const GUIDE = { stroke: "#9AA59E", strokeWidth: 5, strokeDasharray: "2 14", strokeLinecap: "round" as const, fill: "none" };

function samplePath(fn: (t: number) => [number, number], steps = 120): string {
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const [x, y] = fn(i / steps);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d;
}

function tracePath(pattern: Extract<WorksheetTemplate, { kind: "trace" }>["pattern"], y: number, x1: number, x2: number, amp: number): string {
  const L = x2 - x1;
  switch (pattern) {
    case "straight": return `M${x1} ${y} L${x2} ${y}`;
    case "wave": return samplePath((t) => [x1 + t * L, y + Math.sin(t * Math.PI * 4) * amp]);
    case "zigzag": {
      const n = 6;
      let d = `M${x1} ${y}`;
      for (let i = 1; i <= n; i++) d += ` L${x1 + (L * i) / n} ${y + (i % 2 ? -amp : amp) * (i === n ? 0 : 1)}`;
      return d;
    }
    case "loop": {
      const loops = 3, rx = 64, ry = 52;
      return samplePath((t) => {
        const a = t * loops * Math.PI * 2;
        return [x1 + t * L - rx * Math.sin(a), y - ry * (1 - Math.cos(a)) + ry / 2];
      }, 300);
    }
    case "steps": {
      const n = 4, sw = L / n, sh = (amp * 2) / n;
      let d = `M${x1} ${y - amp}`;
      for (let i = 0; i < n; i++) d += ` l${sw} 0 l0 ${sh}`;
      return d;
    }
  }
}

function Body({ t }: { t: WorksheetTemplate }) {
  switch (t.kind) {
    case "color":
      return <PictureG kind={t.picture} mode="outline" x={90} y={90} size={520} />;

    case "dots": {
      const cols = 3, r = 40;
      const rows = Math.ceil(t.count / cols);
      return (
        <>
          <PictureG kind={t.picture} mode="fill" x={260} y={10} size={180} />
          {Array.from({ length: t.count }, (_, i) => {
            const row = Math.floor(i / cols), col = i % cols;
            const inRow = Math.min(cols, t.count - row * cols);
            const cx = W / 2 + (col - (inRow - 1) / 2) * 170;
            const cy = 260 + row * ((H - 300) / Math.max(rows, 2)) + 40;
            return <circle key={i} cx={cx} cy={cy} r={r + 14} fill="none" stroke={INK} strokeWidth={4} strokeDasharray="10 9" />;
          })}
        </>
      );
    }

    case "trace": {
      const gap = H / t.rows;
      return (
        <>
          {Array.from({ length: t.rows }, (_, i) => {
            const y = gap * i + gap / 2;
            const amp = Math.min(46, gap / 3);
            return (
              <g key={i}>
                <PictureG kind={t.from} x={10} y={y - 55} size={110} />
                <path d={tracePath(t.pattern, y, 140, 560, amp)} {...GUIDE} />
                <circle cx={140} cy={t.pattern === "steps" ? y - amp : y} r={9} fill="#3A9B4C" />
                <PictureG kind={t.to} x={580} y={y - 55} size={110} />
              </g>
            );
          })}
        </>
      );
    }

    case "match": {
      const n = t.items.length;
      const right = [...t.items.slice(1), t.items[0]];
      const gap = H / n;
      return (
        <>
          {t.items.map((k, i) => (
            <g key={`l${k}`}>
              <PictureG kind={k} x={60} y={gap * i + gap / 2 - 70} size={140} />
              <circle cx={230} cy={gap * i + gap / 2} r={10} fill={INK} />
            </g>
          ))}
          {right.map((k, i) => (
            <g key={`r${k}`}>
              <circle cx={470} cy={gap * i + gap / 2} r={10} fill={INK} />
              <PictureG kind={k} mode="shadow" x={500} y={gap * i + gap / 2 - 70} size={140} />
            </g>
          ))}
        </>
      );
    }

    case "count": {
      const order = Array.from({ length: t.max }, (_, i) => i + 1);
      const rowsOrder = [...order.slice(1), order[0]];
      const gap = H / t.max;
      const pic = Math.min(110, gap - 20);
      return (
        <>
          {rowsOrder.map((n, i) => {
            const y = gap * i + gap / 2;
            return (
              <g key={i}>
                {Array.from({ length: n }, (_, j) => <PictureG key={j} kind={t.picture} x={20 + j * (pic + 6)} y={y - pic / 2} size={pic} />)}
                <line x1={390} y1={y - gap / 2 + 10} x2={390} y2={y + gap / 2 - 10} stroke="#ECE3D0" strokeWidth={3} />
                {order.map((m, k) => (
                  <g key={m} transform={`translate(${430 + k * (240 / t.max)} ${y})`}>
                    {Array.from({ length: m }, (_, d) => <circle key={d} cx={0} cy={(d - (m - 1) / 2) * 24} r={9} fill={INK} />)}
                  </g>
                ))}
              </g>
            );
          })}
        </>
      );
    }

    case "size":
      return (
        <>
          <PictureG kind={t.picture} x={30} y={30} size={330} />
          <PictureG kind={t.picture} x={470} y={190} size={150} />
          <line x1={40} y1={390} x2={660} y2={390} stroke="#ECE3D0" strokeWidth={3} />
          <PictureG kind={t.picture} x={80} y={570} size={150} />
          <PictureG kind={t.picture} x={340} y={410} size={330} />
        </>
      );

    case "same": {
      const rows: PictureKind[][] = [
        [t.others[0], t.target, t.others[1] ?? t.others[0]],
        [t.target, t.others[1] ?? t.others[0], t.others[0]],
      ];
      return (
        <>
          {rows.map((opts, r) => {
            const y = r * 380 + 60;
            return (
              <g key={r}>
                <rect x={10} y={y - 10} width={180} height={200} rx={24} fill="#FFF9EE" stroke="#F7A363" strokeWidth={4} />
                <PictureG kind={t.target} x={30} y={y + 10} size={140} />
                {opts.map((k, i) => <PictureG key={i} kind={k} x={230 + i * 160} y={y + 20} size={130} />)}
              </g>
            );
          })}
        </>
      );
    }

    case "path": {
      const d = "M150 640 C 330 640, 180 430, 360 400 S 470 170, 560 140";
      return (
        <>
          <path d={d} stroke={INK} strokeWidth={104} fill="none" strokeLinecap="round" />
          <path d={d} stroke="#E2F2FB" strokeWidth={92} fill="none" strokeLinecap="round" />
          <path d={d} {...GUIDE} />
          <PictureG kind={t.from} x={20} y={560} size={140} />
          <PictureG kind={t.to} x={560} y={40} size={130} />
        </>
      );
    }
  }
}

export function WorksheetSheet({ ws }: { ws: Worksheet }) {
  return (
    <article className="sheet" aria-label={`ใบงาน ${ws.title.th}`}>
      <header className="sheet__head">
        <div className="sheet__brand"><LogoMark size={28} /><span>growlilo<span style={{ color: "#F7A363" }}>.</span></span></div>
        <div className="sheet__titles">
          <h2>{ws.title.th}</h2>
          <p lang="en">{ws.title.en}</p>
        </div>
        <div className="sheet__age">{ws.age_bands.map((b) => b.replace("-", "–")).join(", ")} ปี</div>
      </header>
      <p className="sheet__inst">{ws.instruction.th} <span lang="en">— {ws.instruction.en}</span></p>
      <svg className="sheet__body" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ws.instruction.th}>
        <Body t={ws.template} />
      </svg>
      <footer className="sheet__foot">
        <div>
          <b>คำศัพท์ชวนคุย</b>
          <p>{ws.words.map((w) => `${w.th} = ${w.en}`).join(" • ")}</p>
        </div>
        <div>
          <b>สำหรับผู้ใหญ่</b>
          <p>{ws.adult_tips[0]} {ws.safety[0]}</p>
        </div>
        <small>© Growlilo — พิมพ์ใช้ในครอบครัวเท่านั้น • {ws.id}</small>
      </footer>
    </article>
  );
}
