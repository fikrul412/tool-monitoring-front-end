import { useQuery } from "@tanstack/react-query";

import { laboratoryService } from "@/features/laboratory/services/laboratory.service";
import { equipmentService } from "@/features/equipment/services/equipment.service";
import { materialsService } from "@/features/materials/services/materials.service";

import { lecturerService } from "../services/lecturer.service";

export const researchOptionKeys = {
  labs: ["research", "options", "laboratories"] as const,
  tools: ["research", "options", "equipment"] as const,
  materials: ["research", "options", "materials"] as const,
  lecturers: ["research", "options", "lecturers"] as const,
};

export function useResearchLaboratories() {
  return useQuery({
    queryKey: researchOptionKeys.labs,
    queryFn: async () => {
      const response = await laboratoryService.getLabs({
        page: 1,
        limit: 100,
      });

      return response.data;
    },
  });
}

export function useResearchEquipment() {
  return useQuery({
    queryKey: researchOptionKeys.tools,
    queryFn: async () => {
      const response = await equipmentService.getTools({
        page: 1,
        limit: 100,
      });

      return response.data;
    },
  });
}

export function useResearchMaterials() {
  return useQuery({
    queryKey: researchOptionKeys.materials,
    queryFn: async () => (await materialsService.getMaterials({ page: 1, limit: 100 })).data,
  });
}

export function useResearchLecturers() {
  return useQuery({
    queryKey: researchOptionKeys.lecturers,
    queryFn: () => lecturerService.getLecturers({ limit: 50 }),
  });
}
