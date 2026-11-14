import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AttendanceWorkflow from './attendance-workflow';
import { attendanceService } from '../attendance.service';

vi.mock('../attendance.service', () => ({
  attendanceService: {
    options: vi.fn(), request: vi.fn(), confirm: vi.fn(), history: vi.fn(), adminLogs: vi.fn(), adminSummary: vi.fn(),
  },
}));

function renderWorkflow() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(<QueryClientProvider client={client}><AttendanceWorkflow /></QueryClientProvider>);
}

describe('AttendanceWorkflow', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows entry QR without confirming attendance until Okay is pressed', async () => {
    vi.mocked(attendanceService.options).mockResolvedValue({ labs: [{ id: 'lab-1', name: 'Lab Kimia', location: 'Gedung A' }], researches: [{ id: 'research-1', title: 'Research A' }], current: null } as never);
    vi.mocked(attendanceService.request).mockResolvedValue({ result: 'QR_REQUIRED', type: 'ENTRY', labId: 'lab-1', researchId: null, qrPayload: 'entry-token' } as never);
    vi.mocked(attendanceService.confirm).mockResolvedValue({ authenticated: true, changed: true } as never);
    renderWorkflow();

    fireEvent.change(await screen.findByLabelText('Laboratorium'), { target: { value: 'lab-1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ajukan kehadiran' }));
    expect(await screen.findByText('QR autentikasi masuk')).toBeInTheDocument();
    expect(document.querySelector('svg')).toBeInTheDocument();
    expect(attendanceService.confirm).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /Okay/ }));
    await waitFor(() => expect(attendanceService.confirm).toHaveBeenCalledWith({ labId: 'lab-1', researchId: undefined, type: 'ENTRY', result: 'OK' }, expect.anything()));
  });

  it('reports failed authentication and requests a separate exit QR for active attendance', async () => {
    vi.mocked(attendanceService.options).mockResolvedValue({ labs: [], researches: [], current: { labId: 'lab-1', labName: 'Lab Kimia', location: 'Gedung A', researchId: null, researchTitle: null } } as never);
    vi.mocked(attendanceService.request).mockResolvedValue({ result: 'QR_REQUIRED', type: 'EXIT', labId: 'lab-1', qrPayload: 'exit-token' } as never);
    vi.mocked(attendanceService.confirm).mockResolvedValue({ authenticated: false, changed: false } as never);
    renderWorkflow();

    fireEvent.click(await screen.findByRole('button', { name: 'Ajukan pulang' }));
    expect(await screen.findByText('QR autentikasi pulang')).toBeInTheDocument();
    expect(attendanceService.confirm).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Failed' }));
    expect(await screen.findByText('Autentikasi gagal. Tidak ada log absensi yang dibuat.')).toBeInTheDocument();
    expect(attendanceService.confirm).toHaveBeenCalledWith({ labId: 'lab-1', researchId: undefined, type: 'EXIT', result: 'FAILED' }, expect.anything());
  });
});
