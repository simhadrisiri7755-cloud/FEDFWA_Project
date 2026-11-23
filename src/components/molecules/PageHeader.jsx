export default function PageHeader({ title, description, actions, eyebrow }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 motion-safe:animate-fade-up">
      <div>
        {eyebrow && <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.14em] text-link">{eyebrow}</p>}
        <h1 className="text-[1.75rem] font-extrabold leading-tight tracking-tight text-ink sm:text-[2.125rem]">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}
