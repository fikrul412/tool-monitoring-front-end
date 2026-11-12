import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { materialsService } from "../services/materials.service";
import type {
  CreateMaterialPayload,
  GetMaterialsQueryParams,
  UpdateMaterialPayload,
} from "../types/materials.types";

export const MATERIALS_QUERY_KEY = ["materials"];

export function useMaterials(params?: GetMaterialsQueryParams) {
  return useQuery({
    queryKey: [...MATERIALS_QUERY_KEY, params],
    queryFn: () => materialsService.getMaterials(params),
  });
}

export function useMaterial(id: string) {
  return useQuery({
    queryKey: [...MATERIALS_QUERY_KEY, id],
    queryFn: () => materialsService.getMaterialById(id),
    enabled: !!id,
  });
}

export function useCreateMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMaterialPayload) => materialsService.createMaterial(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MATERIALS_QUERY_KEY });
    },
  });
}

export function useUpdateMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateMaterialPayload }) =>
      materialsService.updateMaterial(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MATERIALS_QUERY_KEY });
    },
  });
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => materialsService.deleteMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MATERIALS_QUERY_KEY });
    },
  });
}
