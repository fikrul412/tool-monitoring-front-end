
import { z } from "zod";

export const researchSchema = z
  .object({
    title: z
      .string()
      .min(5, "Research title must be at least 5 characters")
      .max(255, "Research title cannot exceed 255 characters"),

    startDate: z.string().optional().or(z.literal("")),
    endDate: z.string().optional().or(z.literal("")),

    supervisorIds: z
      .array(z.string().uuid())
      .min(1, "Select at least one supervisor"),

    labIds: z
      .array(z.string().uuid())
      .min(1, "Select at least one laboratory"),

    toolIds: z
      .array(z.string().uuid())
      .default([]),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return data.endDate >= data.startDate;
    },
    {
      message: "End date cannot precede start date",
      path: ["endDate"],
    },
  );

export type ResearchFormInput = z.input<
  typeof researchSchema
>;

export type ResearchFormValues = z.output<
  typeof researchSchema
>;
