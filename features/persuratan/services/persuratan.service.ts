import { api } from '@/lib/axios';

export type LetterType = 'LAB_ACCESS' | 'LAB_CLEARANCE';
export interface EligibleResearch { id: string; title: string; status: string }
export interface LetterApplication {
  id: string;
  researchId: string;
  researchTitle: string;
  type: LetterType;
  status: 'SUBMITTED' | 'RECEIVED' | 'REJECTED';
  reviewComments?: string | null;
  createdAt: string;
}
export const persuratanService = {
  async eligible() { return (await api.get<{ labAccess: EligibleResearch[]; labClearance: EligibleResearch[] }>('/persuratan/eligible')).data; },
  async archive() { return (await api.get<LetterApplication[]>('/persuratan/archive')).data; },
  async apply(researchId: string, type: LetterType) { return (await api.post<LetterApplication>('/persuratan/applications', { researchId, type })).data; },
  async adminApplications() { return (await api.get<Array<LetterApplication & { researchStatus: string; student: { id: string; name: string; nim: string } }>>('/persuratan/admin/applications')).data; },
  async review(id: string, decision: 'RECEIVED' | 'REJECTED', comments?: string) { return (await api.patch<LetterApplication>(`/persuratan/admin/applications/${id}/review`, { decision, comments })).data; },
};
