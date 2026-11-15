'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export function QrDisplay({ value, size = 256 }: { value: string; size?: number }) {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="group rounded-lg bg-white p-4 shadow-sm"
        onClick={() => setFullscreen(true)}
        aria-label="Perbesar QR agar lebih mudah dipindai"
      >
        <span className="flex flex-col items-center gap-2">
          <QRCodeSVG value={value} size={size} level="M" includeMargin />
          <span className="text-xs text-muted-foreground group-hover:underline">Klik untuk layar penuh</span>
        </span>
      </button>
      {fullscreen && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="QR layar penuh"
          onClick={() => setFullscreen(false)}
        >
          <div className="w-[min(88vw,78vh,720px)] rounded-2xl bg-white p-5" onClick={event => event.stopPropagation()}>
            <QRCodeSVG value={value} size={720} level="M" includeMargin className="h-auto w-full" />
          </div>
          <button
            type="button"
            className="rounded-md border border-white/70 px-5 py-2 text-sm font-medium text-white"
            onClick={() => setFullscreen(false)}
          >
            Tutup
          </button>
        </div>
      )}
    </>
  );
}
