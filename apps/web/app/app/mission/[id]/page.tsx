import { notFound } from "next/navigation";
import { MISSIONS, getMission } from "@/lib/content";
import { MissionParentView } from "@/components/app/MissionParentView";

export const dynamicParams = false;
export function generateStaticParams() {
  return MISSIONS.map((m) => ({ id: m.id }));
}

export default async function MissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getMission(id)) notFound();
  return <MissionParentView missionId={id} />;
}
