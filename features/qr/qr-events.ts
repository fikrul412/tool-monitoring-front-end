import { api } from '@/lib/axios';

export type QrScanResult = { authenticated: boolean; pending?: boolean; userId?: string; role?: string; jti?: string; message?: string };

export function listenForQrResult(jti: string, onResult: (result: QrScanResult) => void) {
  let active = true;
  let inFlight = false;
  const poll = async () => {
    if (!active || inFlight) return;
    inFlight = true;
    try {
      const { data } = await api.get<QrScanResult>(`/qr/status/${encodeURIComponent(jti)}`);
      if (active && !data.pending) {
        active = false;
        window.clearInterval(timer);
        onResult(data);
      }
    } catch (error) {
      if (active) console.error('QR status polling failed', error);
    } finally {
      inFlight = false;
    }
  };

  const timer = window.setInterval(() => void poll(), 1000);
  void poll();
  return () => {
    active = false;
    window.clearInterval(timer);
  };
}
