import useSpotlight from '../../hooks/useSpotlight';

/** Page-wide soft light that trails the cursor. Purely decorative, so it is hidden from assistive tech. */
export default function CursorAura() {
  useSpotlight();
  return <div aria-hidden="true" className="cursor-aura no-print" />;
}
