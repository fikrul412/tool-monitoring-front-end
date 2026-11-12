import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { laboratoryService } from "../services/laboratory.service";
import type {
  AssignLabManagerPayload,
  CreateLabPayload,
  GetLabsQueryParams,
  UpdateLabPayload,
} from "../types/laboratory.types";

export const LABS_QUERY_KEY = ["laboratories"];

export function useLabs(params?: GetLabsQueryParams) {
  return useQuery({
    queryKey: [...LABS_QUERY_KEY, params],
    queryFn: () => laboratoryService.getLabs(params),
  });
}

export function useLab(id: string) {
  return useQuery({
    queryKey: [...LABS_QUERY_KEY, id],
    queryFn: () => laboratoryService.getLabById(id),
    enabled: !!id,
  });
}

export function useCreateLab() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLabPayload) => laboratoryService.createLab(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LABS_QUERY_KEY });
    },
  });
}

export function useUpdateLab() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateLabPayload }) =>
      laboratoryService.updateLab(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LABS_QUERY_KEY });
    },
  });
}

export function useDeleteLab() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => laboratoryService.deleteLab(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LABS_QUERY_KEY });
    },
  });
}

export function useAssignLabManager() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      labId,
      payload,
    }: {
      labId: string;
      payload: AssignLabManagerPayload;
    }) => laboratoryService.assignManager(labId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LABS_QUERY_KEY });
    },
  });
}

export function useRemoveLabManager() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ labId, userId }: { labId: string; userId: string }) =>
      laboratoryService.removeManager(labId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LABS_QUERY_KEY });
    },
  });
}
