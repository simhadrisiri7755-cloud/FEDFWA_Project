/** Surface container. When `title` is given it renders a labelled <section>. */
export default function Card({ title, description, action, children, className = '', padded = true, as: Tag = 'section' }) {
  const headingId = title ? `card-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : undefined;
  return (
    <Tag
      aria-labelledby={headingId}
      className={`spotlight rounded-3xl border border-line bg-card shadow-card transition-colors duration-300 ${className}`}
    >
      {title && (
        <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
          <div>
            <h2 id={headingId} className="text-[1.0625rem] font-bold tracking-tight text-ink">
              {title}
            </h2>
            {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={padded ? `p-5 sm:p-6 ${title ? 'pt-4 sm:pt-5' : ''}` : ''}>{children}</div>
    </Tag>
  );
}
