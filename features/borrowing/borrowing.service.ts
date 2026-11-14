import { api } from '@/lib/axios';

export const borrowingService = {
  materials: async () => (await api.get<Array<{ id: string; materialId: string; materialName: string; unit: string; quantity: string; status: string; reviewComments: string | null; description: string | null; createdAt: string }>>('/borrowing/materials/me')).data,
  requestMaterial: async (payload: { materialId: string; quantity: number; description?: string }) => (await api.post('/borrowing/materials', payload)).data,
  pendingMaterials: async () => (await api.get<Array<{ id: string; materialName: string; unit: string; quantity: string; description: string | null; createdAt: string; student: { name: string; nim: string | null } }>>('/borrowing/materials/pending')).data,
  reviewMaterial: async (id: string, status: 'APPROVED' | 'REJECTED') => (await api.post(`/borrowing/materials/${id}/review`, { status })).data,
  requestBorrow: async (payload: { toolId: string; durationMinutes: number }) => (await api.post<{ toolId: string; result: 'REJECTED' | 'QR_REQUIRED'; qrPayload?: string }>('/borrowing/tools/borrow', payload)).data,
  confirmBorrow: async (payload: { toolId: string; durationMinutes: number; result: 'OK' | 'FAILED' }) => (await api.post('/borrowing/tools/borrow/confirm', payload)).data,
  myTools: async () => (await api.get<Array<{ id: string; toolId: string; toolName: string; inventoryCode: string | null; type: string; status: string; description: string | null; time: string }>>('/borrowing/tools/me')).data,
  requestReturn: async (toolId: string) => (await api.post<{ toolId: string; qrPayload: string }>(`/borrowing/tools/${toolId}/return`)).data,
  confirmReturn: async (payload: { toolId: string; result: 'OK' | 'FAILED'; condition?: string; notes?: string }) => (await api.post('/borrowing/tools/return/confirm', payload)).data,
  schedules: async (toolId?: string) => (await api.get<Array<{ id: string; toolId: string; toolName: string; studentId: string; studentName: string; startTime: string; endTime: string; location: string | null; description: string | null; reviewStatus: string }>>('/borrowing/schedules', { params: toolId ? { toolId } : {} })).data,
  mySchedules: async () => (await api.get<Array<{ id: string; toolId: string; toolName: string; studentId: string; studentName: string; startTime: string; endTime: string; location: string | null; description: string | null; reviewStatus: string }>>('/borrowing/schedules/me')).data,
  requestSchedule: async (payload: { toolId: string; startTime: string; endTime: string; description?: string }) => (await api.post<{ result?: 'REJECTED' } | { id: string }>('/borrowing/schedules', payload)).data,
  pendingSchedules: async () => (await api.get<Array<{ id: string; toolName: string; studentName: string; nim: string | null; startTime: string; endTime: string; location: string | null; description: string | null }>>('/borrowing/admin/schedules/pending')).data,
  reviewSchedule: async (id: string, decision: 'APPROVED' | 'REJECTED') => (await api.post(`/borrowing/admin/schedules/${id}/review`, { decision })).data,
};
