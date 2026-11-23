import { useRef } from 'react';

/** Accessible tab list (roving tabindex + arrow keys). Panels are rendered by the caller with role="tabpanel". */
export default function Tabs({ label, tabs, value, onChange, idPrefix = 'tab' }) {
  const refs = useRef({});

  const onKeyDown = (e) => {
    const index = tabs.findIndex((t) => t.value === value);
    let next = null;
    if (e.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (next === null) return;
    e.preventDefault();
    onChange(tabs[next].value);
    refs.current[tabs[next].value]?.focus();
  };

  return (
    <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className="mb-6 inline-flex rounded-2xl bg-surface-2 p-1">
      {tabs.map((t) => {
        const selected = t.value === value;
        return (
          <button
            key={t.value}
            ref={(el) => (refs.current[t.value] = el)}
            role="tab"
            id={`${idPrefix}-${t.value}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(t.value)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              selected ? 'bg-card text-ink shadow-sm' : 'text-muted hover:text-ink'
            }`}
          >
            {t.label}
            {t.count > 0 && (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-on-primary">{t.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
