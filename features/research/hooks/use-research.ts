import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { researchService } from "../services/research.service";

import type {
  AdminResearchQuery, ResearchStatus,
} from "../types/research.types";

// Query keys
export const researchKeys = {
  all: ["research"] as const,

  myResearch: (page: number, limit: number) =>
    [...researchKeys.all, "me", page, limit] as const,

  allResearch: (params: AdminResearchQuery) =>
    [...researchKeys.all, "admin", params] as const,

  detail: (id: string) =>
    [...researchKeys.all, "detail", id] as const,

  logs: (id: string) =>
    [...researchKeys.all, "logs", id] as const,
};

// Student research list
export function useMyResearch(page = 1, limit = 10, filters: { search?: string; status?: ResearchStatus } = {}) {
  return useQuery({
    queryKey: [...researchKeys.myResearch(page, limit), filters],
    queryFn: () => researchService.getMyResearch({ page, limit, ...filters }),
    placeholderData: keepPreviousData,
  });
}

// Admin research list
export function useAllResearch(params: AdminResearchQuery = {}) {
  return useQuery({
    queryKey: researchKeys.allResearch(params),
    queryFn: () => researchService.getAll(params),
    placeholderData: keepPreviousData,
  });
}

// Research detail
export function useResearchDetail(id: string) {
  return useQuery({
    queryKey: researchKeys.detail(id),
    queryFn: () => researchService.getById(id),
    enabled: Boolean(id),
  });
}

// Research application logs
export function useResearchLogs(id: string) {
  return useQuery({
    queryKey: researchKeys.logs(id),
    queryFn: () => researchService.getLogs(id),
    enabled: Boolean(id),
  });
}
