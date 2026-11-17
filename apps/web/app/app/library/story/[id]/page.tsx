import { notFound } from "next/navigation";
import { ALL_STORIES, getStory } from "@/lib/content";
import { StoryView } from "@/components/library/StoryView";

export const dynamicParams = false;
export function generateStaticParams() {
  return ALL_STORIES.map((s) => ({ id: s.id }));
}
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getStory(id)) notFound();
  return <StoryView id={id} />;
}
