import { ResearchForm } from "@/features/research/components/student/research-form";

export default function CreateResearchPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">
          New Research Application
        </h1>

        <p className="text-sm text-muted-foreground">
          Submit your research proposal for administrative review.
        </p>
      </div>

      <ResearchForm />
    </div>
  );
}