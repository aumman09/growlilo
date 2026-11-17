import "@/styles/library-shared.css";
import type { StoryPage } from "@growlilo/game-core";
import { Grow, Lilo } from "@/components/brand/Mascots";
import { Picture } from "@/components/brand/Picture";

/** Simple illustrated scene composed from original mascots + pictures. */
export function Scene({ scene }: { scene: StoryPage["scene"] }) {
  return (
    <div className={`scene scene--${scene.bg}`} aria-hidden>
      <div className="scene__deco" />
      <div className="scene__cast">
        {scene.cast.includes("grow") && <Grow size={150} className="scene__grow" expr={scene.bg === "night" ? "calm" : "happy"} />}
        {scene.cast.includes("lilo") && <Lilo size={120} expr={scene.bg === "night" ? "calm" : "happy"} />}
        {scene.item && <span className="scene__item"><Picture kind={scene.item} size={110} /></span>}
      </div>
    </div>
  );
}
