import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProfileContent from './profile-content';
import { identityService } from '@/features/auth/services/identity.service';
import { useAuthStore } from '@/features/auth/stores/auth.store';

vi.mock('@/features/auth/services/identity.service', () => ({ identityService: { getMe: vi.fn(), updateMyProfile: vi.fn() } }));

describe('ProfileContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ user: { id: 'student-1', email: 'student@example.test', role: 'STUDENT', status: 'ACTIVE', profile: { name: 'Student One', nim: '123', whatsapp: null } }, status: 'authenticated' });
  });

  it('updates name and WhatsApp and refreshes the current identity', async () => {
    const updated = { id: 'student-1', email: 'student@example.test', role: 'STUDENT' as const, status: 'ACTIVE', profile: { name: 'Updated Name', nim: '123', whatsapp: '08123456789' } };
    vi.mocked(identityService.updateMyProfile).mockResolvedValue(updated);
    const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
    render(<QueryClientProvider client={client}><ProfileContent /></QueryClientProvider>);

    fireEvent.change(screen.getByLabelText('Nama'), { target: { value: 'Updated Name' } });
    fireEvent.change(screen.getByLabelText('Nomor WhatsApp'), { target: { value: '08123456789' } });
    fireEvent.click(screen.getByRole('button', { name: 'Simpan profil' }));

    await waitFor(() => expect(identityService.updateMyProfile).toHaveBeenCalledWith({ name: 'Updated Name', whatsapp: '08123456789' }, expect.anything()));
    expect(await screen.findByText('Profil berhasil diperbarui.')).toBeInTheDocument();
    expect(useAuthStore.getState().user).toEqual(updated);
  });
});
