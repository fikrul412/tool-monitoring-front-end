import { ResearchForm } from "@/features/research/components/student/research-form";

export default async function EditResearchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div className="mx-auto max-w-3xl space-y-6 p-6"><div><h1 className="text-2xl font-bold">Edit research application</h1><p className="text-sm text-muted-foreground">Only pending applications can be edited.</p></div><ResearchForm researchId={id} /></div>;
}
