import { ResearchDetail } from "@/features/research/research-detail";

export default async function ResearchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ResearchDetail id={id} />;
}
