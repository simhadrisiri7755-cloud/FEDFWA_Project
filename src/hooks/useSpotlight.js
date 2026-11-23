import { useEffect } from 'react';

/**
 * Cursor-follow lighting.
 *  - --gx / --gy on <html> drive the soft page-wide aura (smoothly eased towards the pointer).
 *  - every element with the `.spotlight` class gets --mx / --my (pointer position inside it),
 *    which the CSS uses for the inner glow and the glowing border.
 * One pointermove listener + one rAF loop for the whole app. Off for touch screens and for
 * people who prefer reduced motion.
 */
export default function useSpotlight() {
  useEffect(() => {
    const fine = window.matchMedia?.('(pointer: fine)').matches;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return undefined;

    const root = document.documentElement;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    let started = false;

    const paint = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      root.style.setProperty('--gx', `${x}px`);
      root.style.setProperty('--gy', `${y}px`);
      document.querySelectorAll('.spotlight').forEach((el) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${tx - r.left}px`);
        el.style.setProperty('--my', `${ty - r.top}px`);
      });
      raf = Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5 ? requestAnimationFrame(paint) : 0;
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!started) {
        started = true;
        x = tx;
        y = ty;
        root.style.setProperty('--aura-on', '1');
      }
      schedule();
    };

    const onOut = (e) => {
      if (e.relatedTarget) return; // still inside the window
      root.style.setProperty('--aura-on', '0');
      document.querySelectorAll('.spotlight').forEach((el) => {
        el.style.setProperty('--mx', '-999px');
        el.style.setProperty('--my', '-999px');
      });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', schedule, { passive: true });
    document.addEventListener('mouseout', onOut);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', schedule);
      document.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(raf);
    };
  }, []);
}
