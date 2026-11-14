
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { researchService } from "../services/research.service";
import { researchKeys } from "./use-research";

import type {
  CreateResearchPayload,
  UpdateResearchPayload,
  ReviewResearchPayload,
  UpdateResearchStatusPayload,
} from "../types/research.types";

export function useCreateResearch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateResearchPayload) =>
      researchService.create(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: researchKeys.all,
      });
    },
  });
}

export function useUpdateResearch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateResearchPayload;
    }) => researchService.update(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: researchKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: researchKeys.detail(variables.id),
      });
    },
  });
}

export function useReviewResearch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ReviewResearchPayload;
    }) => researchService.review(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: researchKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: researchKeys.detail(variables.id),
      });

      queryClient.invalidateQueries({
        queryKey: researchKeys.logs(variables.id),
      });
    },
  });
}

export function useUpdateResearchStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateResearchStatusPayload }) => researchService.updateStatus(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: researchKeys.all });
      queryClient.invalidateQueries({ queryKey: researchKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: researchKeys.logs(variables.id) });
    },
  });
}

export function useRequestResearchCompletion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => researchService.requestCompletion(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: researchKeys.all });
      queryClient.invalidateQueries({ queryKey: researchKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: researchKeys.logs(id) });
    },
  });
}
