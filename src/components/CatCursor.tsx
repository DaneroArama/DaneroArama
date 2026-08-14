'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Cat3D from './Cat3D';

const CAT_SIZE = 500;

function CloseIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function CatCursor() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const followRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = () => setIsMobile(window.innerWidth < 640);
    mq();
    window.addEventListener('resize', mq);
    return () => window.removeEventListener('resize', mq);
  }, []);

  // Desktop: smooth follow the mouse cursor
  useEffect(() => {
    if (!open || isMobile) return;
    const el = followRef.current;
    if (!el) return;

    const s = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      tx: window.innerWidth / 2,
      ty: window.innerHeight / 2,
    };

    const onMove = (e: MouseEvent) => {
      s.tx = e.clientX;
      s.ty = e.clientY;
    };

    let raf = 0;
    const loop = () => {
      s.x += (s.tx - s.x) * 0.18;
      s.y += (s.ty - s.y) * 0.18;
      el.style.transform = `translate3d(${(s.x - CAT_SIZE / 2 + 24).toFixed(1)}px, ${(s.y - CAT_SIZE / 2 - 64).toFixed(1)}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [open, isMobile]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Hide 3D cat' : 'Show 3D cat'}
        title="Pet the cat?"
        className="inline-flex cursor-pointer items-center justify-center rounded-full text-2xl md:text-3xl transition-transform duration-300 hover:scale-110 active:scale-95"
      >
        🐱
      </button>

      {/* Mobile: cat sits at the end of the screen */}
      {open && isMobile &&
        createPortal(
          <div className="pointer-events-none fixed bottom-5 left-1/2 z-9999 -translate-x-1/2">
            <div className="relative">
              <Cat3D size={CAT_SIZE} />
            </div>
          </div>,
          document.body
        )}

      {/* Desktop: cat follows the mouse cursor */}
      {open && !isMobile &&
        createPortal(
          <div ref={followRef} className="pointer-events-none fixed left-0 top-0 z-9999 will-change-transform">
            <div className="relative">
              <Cat3D size={CAT_SIZE} />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}