import { notFound } from "next/navigation";
import { ALL_WORKSHEETS, getWorksheet } from "@/lib/content";
import { WorksheetView } from "@/components/library/WorksheetView";

export const dynamicParams = false;
export function generateStaticParams() {
  return ALL_WORKSHEETS.map((w) => ({ id: w.id }));
}
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getWorksheet(id)) notFound();
  return <WorksheetView id={id} />;
}
