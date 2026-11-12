import { ResearchDetail } from "@/features/research/research-detail";
import { ResearchReviewPanel } from "@/features/research/components/admin/research-review-panel";

export default async function AdminResearchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <><ResearchDetail id={id} admin /><ResearchReviewPanel id={id} /></>;
}
