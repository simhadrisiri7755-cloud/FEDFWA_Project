import Icon from '../atoms/Icon';
import ThemeToggle from '../molecules/ThemeToggle';
import { BrandMark } from '../organisms/Sidebar';

/** Shared split-screen shell for Sign in and Sign up: brand panel on the left, form on the right. */
export default function AuthLayout({ headline, highlights, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <aside className="bg-hero spotlight spotlight-light relative hidden overflow-hidden p-12 text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between">
        <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        <BrandMark className="relative" />

        <div className="relative max-w-lg">
          <h2 className="text-[2.75rem] font-extrabold leading-[1.1] tracking-tight">{headline}</h2>
          <ul className="mt-8 space-y-4">
            {highlights.map((h) => (
              <li key={h} className="flex items-start gap-3 text-white/85">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-[#9df0e2]">
                  <Icon name="check" className="h-3.5 w-3.5" />
                </span>
                {h}
              </li>
            ))}
          </ul>

          {/* Decorative product preview (hidden from assistive tech) */}
          <div aria-hidden="true" className="mt-12 grid grid-cols-5 gap-3">
            <div className="spotlight spotlight-light col-span-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur motion-safe:animate-float">
              <p className="text-xs font-semibold text-white/70">Attendance today</p>
              <p className="mt-1 text-3xl font-extrabold">92%</p>
              <div className="mt-3 flex h-12 items-end gap-1.5">
                {[40, 65, 50, 80, 62, 92, 74].map((h, i) => (
                  <span key={i} className="flex-1 rounded-t-md bg-white/70" style={{ height: `${h}%`, opacity: 0.35 + i * 0.09 }} />
                ))}
              </div>
            </div>
            <div className="spotlight spotlight-light col-span-2 flex flex-col justify-between rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur motion-safe:animate-float [animation-delay:1.2s]">
              <p className="text-xs font-semibold text-white/70">Pending leave</p>
              <p className="text-3xl font-extrabold">3</p>
              <span className="w-fit rounded-full bg-accent/90 px-2.5 py-0.5 text-xs font-bold text-[#3a2600]">Review</span>
            </div>
          </div>
        </div>

        <p className="relative text-sm text-white/60">© {new Date().getFullYear()} Staffly · Demo project</p>
      </aside>

      <main id="main" className="relative flex items-center justify-center px-5 py-14">
        <div className="absolute right-5 top-5">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md motion-safe:animate-fade-up">
          <BrandMark className="mb-10 text-ink lg:hidden" />
          {children}
        </div>
      </main>
    </div>
  );
}
