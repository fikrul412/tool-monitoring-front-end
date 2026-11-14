import { api } from '@/lib/axios';

export type WasteOptionType = 'CATEGORY' | 'UNIT' | 'PHASE' | 'HANDLING';
export interface WasteOption { id: string; type: WasteOptionType; value: string }
export interface WasteRecord { id: string; category: string; quantity: string; unit: string; phase: string; handling: string; notes: string | null; createdAt: string; researchId: string; researchTitle: string; student: { id: string; name: string; nim: string | null } }

export const wasteService = {
  async options() { return (await api.get<WasteOption[]>('/waste/options')).data; },
  async createOption(payload: { type: WasteOptionType; value: string }) { return (await api.post<WasteOption>('/waste/options', payload)).data; },
  async adminRecords() { return (await api.get<WasteRecord[]>('/waste/admin/records')).data; },
  async deactivateOption(id: string) { return (await api.delete(`/waste/admin/options/${id}`)).data; },
};
