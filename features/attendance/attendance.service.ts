import { api } from '@/lib/axios';

export interface AttendanceLog {
  id: string; userId: string; name: string; role: string; nim: string | null; nip: string | null;
  labName: string; researchTitle: string | null; status: 'ENTRY' | 'EXIT'; recordedAt: string; activity: string | null;
}

export const attendanceService = {
  async options() { return (await api.get('/attendance/options')).data; },
  async request(payload: { labId: string; researchId?: string }) { return (await api.post('/attendance/request', payload)).data; },
  async confirm(payload: { labId: string; researchId?: string; type: 'ENTRY' | 'EXIT'; result: 'OK' | 'FAILED' }) { return (await api.post('/attendance/confirm', payload)).data; },
  async history() { return (await api.get('/attendance/history')).data as Array<{ id: string; type: string; title: string; detail: string; createdAt: string }>; },
  async adminLogs() { return (await api.get('/attendance/admin/logs')).data as AttendanceLog[]; },
  async adminSummary() { return (await api.get('/attendance/admin/summary')).data as { totalLogs: number; entriesToday: number; exitsToday: number; currentlyInLabs: number; recentLogs: AttendanceLog[] }; },
};
