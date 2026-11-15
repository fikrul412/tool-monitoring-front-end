import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AttendanceWorkflow from './attendance-workflow';
import { attendanceService } from '../attendance.service';
import { listenForQrResult } from '@/features/qr/qr-events';

const qrListener = vi.hoisted(() => ({ callback: null as null | ((result: { authenticated: boolean }) => void) }));

vi.mock('../attendance.service', () => ({
  attendanceService: {
    options: vi.fn(), request: vi.fn(), refreshQr: vi.fn(), confirm: vi.fn(), history: vi.fn(), adminLogs: vi.fn(), adminSummary: vi.fn(),
  },
}));
vi.mock('@/features/qr/qr-events', () => ({
  listenForQrResult: vi.fn((_jti: string, callback: (result: { authenticated: boolean }) => void) => {
    qrListener.callback = callback;
    return () => { qrListener.callback = null; };
  }),
}));

function renderWorkflow() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(<QueryClientProvider client={client}><AttendanceWorkflow /></QueryClientProvider>);
}

describe('AttendanceWorkflow', () => {
  beforeEach(() => vi.clearAllMocks());

  it('confirms attendance only after the backend reports successful QR verification', async () => {
    vi.mocked(attendanceService.options).mockResolvedValue({ labs: [{ id: 'lab-1', name: 'Lab Kimia', location: 'Gedung A' }], researches: [{ id: 'research-1', title: 'Research A' }], current: null } as never);
    vi.mocked(attendanceService.request).mockResolvedValue({ result: 'QR_REQUIRED', type: 'ENTRY', labId: 'lab-1', researchId: null, qrPayload: 'entry-token', jti: '11111111-1111-4111-8111-111111111111', expiresAt: new Date(Date.now() + 300_000).toISOString() } as never);
    vi.mocked(attendanceService.confirm).mockResolvedValue({ authenticated: true, changed: true } as never);
    renderWorkflow();

    fireEvent.change(await screen.findByLabelText('Laboratorium'), { target: { value: 'lab-1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ajukan kehadiran' }));
    expect(await screen.findByText('QR autentikasi masuk')).toBeInTheDocument();
    expect(document.querySelector('svg')).toBeInTheDocument();
    expect(attendanceService.confirm).not.toHaveBeenCalled();

    expect(listenForQrResult).toHaveBeenCalledWith('11111111-1111-4111-8111-111111111111', expect.any(Function));
    act(() => qrListener.callback?.({ authenticated: true }));
    await waitFor(() => expect(attendanceService.confirm).toHaveBeenCalledWith({ labId: 'lab-1', researchId: undefined, type: 'ENTRY', result: 'OK', qrJti: '11111111-1111-4111-8111-111111111111' }, expect.anything()));
  });

  it('reports failed authentication and requests a separate exit QR for active attendance', async () => {
    vi.mocked(attendanceService.options).mockResolvedValue({ labs: [], researches: [], current: { labId: 'lab-1', labName: 'Lab Kimia', location: 'Gedung A', researchId: null, researchTitle: null } } as never);
    vi.mocked(attendanceService.request).mockResolvedValue({ result: 'QR_REQUIRED', type: 'EXIT', labId: 'lab-1', researchId: null, qrPayload: 'exit-token', jti: '22222222-2222-4222-8222-222222222222', expiresAt: new Date(Date.now() + 300_000).toISOString() } as never);
    renderWorkflow();

    fireEvent.click(await screen.findByRole('button', { name: 'Ajukan pulang' }));
    expect(await screen.findByText('QR autentikasi pulang')).toBeInTheDocument();
    expect(attendanceService.confirm).not.toHaveBeenCalled();
    act(() => qrListener.callback?.({ authenticated: false }));
    expect(await screen.findByText('QR authentication failed. Please scan a valid, unexpired QR.')).toBeInTheDocument();
    expect(attendanceService.confirm).not.toHaveBeenCalled();
  });
});
