import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import HistoryPage from '@/app/(dashboard)/dashboard/history/page';
import AdminAttendancePage from '@/app/(admin)/admin/attendance/page';
import AdminDashboardContent from '@/features/admin/components/admin-dashboard-content';
import { attendanceService } from '../attendance.service';

vi.mock('../attendance.service', () => ({ attendanceService: { options: vi.fn(), request: vi.fn(), confirm: vi.fn(), history: vi.fn(), adminLogs: vi.fn(), adminSummary: vi.fn() } }));

function renderWithQuery(element: React.ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{element}</QueryClientProvider>);
}

describe('Attendance history and admin pages', () => {
  beforeEach(() => vi.clearAllMocks());

  it('limits activity history to the latest ten items', async () => {
    vi.mocked(attendanceService.history).mockResolvedValue(Array.from({ length: 12 }, (_, index) => ({ id: `activity-${index}`, type: 'ATTENDANCE', title: `Activity ${index}`, detail: 'Lab A', createdAt: '2026-11-14T08:00:00.000Z' })));
    renderWithQuery(<HistoryPage />);
    expect(await screen.findByText('Activity 0')).toBeInTheDocument();
    expect(screen.getByText('Activity 9')).toBeInTheDocument();
    expect(screen.queryByText('Activity 10')).not.toBeInTheDocument();
  });

  it('shows every attendance log in the administrator table', async () => {
    vi.mocked(attendanceService.adminLogs).mockResolvedValue([{ id: 'log-1', userId: 'user-1', name: 'Student One', role: 'STUDENT', nim: '1001', nip: null, labName: 'Lab A', researchTitle: 'Research A', status: 'ENTRY', recordedAt: '2026-11-14T08:00:00.000Z', activity: null }]);
    renderWithQuery(<AdminAttendancePage />);
    expect(await screen.findByText('Student One')).toBeInTheDocument();
    expect(screen.getByText('Lab A')).toBeInTheDocument();
    expect(screen.getByText('Masuk')).toBeInTheDocument();
  });

  it('renders live attendance dashboard metrics', async () => {
    vi.mocked(attendanceService.adminSummary).mockResolvedValue({ totalLogs: 14, entriesToday: 8, exitsToday: 5, currentlyInLabs: 3, recentLogs: [] });
    renderWithQuery(<AdminDashboardContent />);
    expect(await screen.findByText('14')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
