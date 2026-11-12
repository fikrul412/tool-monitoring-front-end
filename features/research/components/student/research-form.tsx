"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  researchSchema,
  type ResearchFormInput,
  type ResearchFormValues,
} from "../../schemas/research.schema";

import {
  useResearchEquipment,
  useResearchLaboratories,
  useResearchLecturers,
} from "../../hooks/use-research-options";

import { useCreateResearch, useUpdateResearch } from "../../hooks/use-research-mutations";
import { useResearchDetail } from "../../hooks/use-research";
import { ResearchMultiSelect } from "./research-multi-select";

export function ResearchForm({ researchId }: { researchId?: string }) {
  const router = useRouter();
  const createResearch = useCreateResearch();
  const updateResearch = useUpdateResearch();
  const existingResearch = useResearchDetail(researchId ?? "");

  const form = useForm<
    ResearchFormInput,
    unknown,
    ResearchFormValues
  >({
    resolver: zodResolver(researchSchema),
    defaultValues: {
      title: "",
      startDate: "",
      endDate: "",
      supervisorIds: [],
      labIds: [],
      toolIds: [],
    },
  });

  useEffect(() => {
    const research = existingResearch.data;
    if (!research) return;
    form.reset({
      title: research.title,
      startDate: research.startDate ?? "",
      endDate: research.endDate ?? "",
      supervisorIds: research.supervisors.map((item) => item.id),
      labIds: research.laboratories.map((item) => item.id),
      toolIds: research.equipment.map((item) => item.id),
    });
  }, [existingResearch.data, form]);

  // Fetch laboratories
  const {
    data: laboratories = [],
    isLoading: isLoadingLaboratories,
    isError: isLaboratoriesError,
  } = useResearchLaboratories();

  // Fetch available equipment
  const {
    data: equipment = [],
    isLoading: isLoadingEquipment,
    isError: isEquipmentError,
  } = useResearchEquipment();

  // Fetch lecturers
  const {
    data: lecturers = [],
    isLoading: isLoadingLecturers,
    isError: isLecturersError,
  } = useResearchLecturers();

  const onSubmit = (values: ResearchFormValues) => {
    const onSuccess = (research: { id: string }) => {
      router.push(`/dashboard/research/${research.id}`);
    };
    if (researchId) {
      updateResearch.mutate({ id: researchId, payload: values }, { onSuccess });
      return;
    }
    createResearch.mutate(values, {
      onSuccess,
    });
  };
  const isPending = createResearch.isPending || updateResearch.isPending;
  const mutationError = createResearch.error ?? updateResearch.error;

  const availableEquipment = equipment.filter(
    (tool) => tool.status === "AVAILABLE",
  );

  if (researchId && existingResearch.isLoading) {
    return <p className="py-10 text-center text-sm text-muted-foreground">Loading application…</p>;
  }
  if (researchId && (existingResearch.isError || existingResearch.data?.status !== "PENDING")) {
    return <div className="space-y-3 rounded-lg border p-5"><p className="text-sm text-destructive">This application could not be loaded or is no longer editable.</p><Button type="button" variant="outline" onClick={() => router.back()}>Go back</Button></div>;
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Research Title */}
      <div className="space-y-2">
        <label
          htmlFor="title"
          className="text-sm font-medium"
        >
          Research Title
        </label>

        <Input
          id="title"
          placeholder="Enter your research title"
          {...form.register("title")}
        />

        {form.formState.errors.title && (
          <p className="text-sm text-destructive">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      {/* Research Period */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="startDate"
            className="text-sm font-medium"
          >
            Start Date
          </label>

          <Input
            id="startDate"
            type="date"
            {...form.register("startDate")}
          />

          {form.formState.errors.startDate && (
            <p className="text-sm text-destructive">
              {form.formState.errors.startDate.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="endDate"
            className="text-sm font-medium"
          >
            End Date
          </label>

          <Input
            id="endDate"
            type="date"
            {...form.register("endDate")}
          />

          {form.formState.errors.endDate && (
            <p className="text-sm text-destructive">
              {form.formState.errors.endDate.message}
            </p>
          )}
        </div>
      </div>

      {/* Research Supervisors */}
      <ResearchMultiSelect
        label="Research Supervisors"
        placeholder="Select supervisors"
        searchPlaceholder="Search lecturers..."
        emptyMessage="No lecturers found."
        options={lecturers.map((lecturer) => ({
          id: lecturer.id,
          label: lecturer.name,
        }))}
        value={form.watch("supervisorIds") ?? []}
        onChange={(value) =>
          form.setValue("supervisorIds", value, {
            shouldValidate: true,
          })
        }
        loading={isLoadingLecturers}
        disabled={isLecturersError}
        error={
          isLecturersError
            ? "Failed to load lecturers."
            : form.formState.errors.supervisorIds?.message
        }
      />

      {/* Laboratories */}
      <ResearchMultiSelect
        label="Laboratories"
        placeholder="Select laboratories"
        searchPlaceholder="Search laboratories..."
        emptyMessage="No laboratories found."
        options={laboratories.map((lab) => ({
          id: lab.id,
          label: lab.name,
          description: lab.location ?? undefined,
        }))}
        value={form.watch("labIds") ?? []}
        onChange={(value) =>
          form.setValue("labIds", value, {
            shouldValidate: true,
          })
        }
        loading={isLoadingLaboratories}
        disabled={isLaboratoriesError}
        error={
          isLaboratoriesError
            ? "Failed to load laboratories."
            : form.formState.errors.labIds?.message
        }
      />

      {/* Equipment */}
      <ResearchMultiSelect
        label="Equipment"
        placeholder="Select equipment (optional)"
        searchPlaceholder="Search equipment..."
        emptyMessage="No available equipment found."
        options={availableEquipment.map((tool) => ({
          id: tool.id,
          label: tool.name,
          description: [
            tool.inventoryCode,
            tool.assignedLabName,
          ]
            .filter(Boolean)
            .join(" • ") || undefined,
        }))}
        value={form.watch("toolIds") ?? []}
        onChange={(value) =>
          form.setValue("toolIds", value, {
            shouldValidate: true,
          })
        }
        loading={isLoadingEquipment}
        disabled={isEquipmentError}
        error={
          isEquipmentError
            ? "Failed to load equipment."
            : form.formState.errors.toolIds?.message
        }
      />

      {/* Submission Error */}
      {mutationError && (
        <p className="text-sm text-destructive">
          {mutationError instanceof Error ? mutationError.message : "Failed to save research application."}
        </p>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={
            isPending ||
            isLoadingLaboratories ||
            isLoadingLecturers ||
            (Boolean(researchId) && existingResearch.isLoading)
          }
        >
          {isPending ? "Saving..." : researchId ? "Save Changes" : "Submit Application"}
        </Button>
      </div>
    </form>
  );
}
