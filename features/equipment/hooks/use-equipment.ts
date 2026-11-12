
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { equipmentService } from "../services/equipment.service";

import type {
  CreateToolPayload,
  GetToolsQueryParams,
  UpdateToolVariables,
  Tool,
  ToolCategory,
} from "../types/equipment.types";

// Query keys
export const equipmentKeys = {
  all: ["equipment"] as const,

  lists: () => [...equipmentKeys.all, "list"] as const,

  list: (params?: GetToolsQueryParams) =>
    [...equipmentKeys.lists(), params] as const,

  details: () => [...equipmentKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...equipmentKeys.details(), id] as const,

  categories: () => [...equipmentKeys.all, "categories"] as const,
};

// ============================================
// Queries
// ============================================

/**
 * Get equipment list with optional filters.
 */
export function useTools(params?: GetToolsQueryParams) {
  return useQuery({
    queryKey: equipmentKeys.list(params),
    queryFn: () => equipmentService.getTools(params),
  });
}

/**
 * Get a single equipment item by ID.
 */
export function useToolById(id: string) {
  return useQuery({
    queryKey: equipmentKeys.detail(id),
    queryFn: () => equipmentService.getToolById(id),
    enabled: !!id,
  });
}

/**
 * Get all equipment categories.
 */
export function useToolCategories() {
  return useQuery<ToolCategory[]>({
    queryKey: equipmentKeys.categories(),
    queryFn: () => equipmentService.getCategories(),
  });
}

// ============================================
// Equipment Mutations
// ============================================

/**
 * Create equipment.
 */
export function useCreateTool() {
  const queryClient = useQueryClient();

  return useMutation<Tool, Error, CreateToolPayload>({
    mutationFn: (payload) =>
      equipmentService.createTool(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: equipmentKeys.all,
      });
    },
  });
}

/**
 * Update equipment.
 */
export function useUpdateTool() {
  const queryClient = useQueryClient();

  return useMutation<Tool, Error, UpdateToolVariables>({
    mutationFn: ({ id, payload }) =>
      equipmentService.updateTool(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: equipmentKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: equipmentKeys.detail(variables.id),
      });
    },
  });
}

/**
 * Delete equipment.
 */
export function useDeleteTool() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string },
    Error,
    string
  >({
    mutationFn: (id) =>
      equipmentService.deleteTool(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: equipmentKeys.all,
      });

      queryClient.removeQueries({
        queryKey: equipmentKeys.detail(id),
      });
    },
  });
}

// ============================================
// Category Mutations
// ============================================

/**
 * Create an equipment category.
 */
export function useCreateToolCategory() {
  const queryClient = useQueryClient();

  return useMutation<
    ToolCategory,
    Error,
    { name: string; description?: string }
  >({
    mutationFn: (payload) =>
      equipmentService.createCategory(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: equipmentKeys.categories(),
      });
    },
  });
}
