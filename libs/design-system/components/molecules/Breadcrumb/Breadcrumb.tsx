import type { FC, ReactNode } from 'react'

export type BreadcrumbItem = {
  label: string
  href?: string
  /** Optional badge rendered after the label (e.g. plan or environment) */
  badge?: ReactNode
  /** Render a chevron switcher trigger after the item */
  switcher?: boolean
}

export type BreadcrumbProps = {
  items: BreadcrumbItem[]
  className?: string
}

// Up/down chevron used by Supabase as the switcher trigger.
const SwitcherChevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m7 15 5 5 5-5" />
    <path d="m7 9 5-5 5 5" />
  </svg>
)

const Breadcrumb: FC<BreadcrumbProps> = ({ items, className = '' }) => (
  <nav aria-label="Breadcrumb" className={`flex items-center gap-2 text-sm ${className}`}>
    {items.map((item, i) => (
      <div key={i} className="flex items-center gap-2">
        {i > 0 && <span className="text-[var(--foreground-muted)]">/</span>}
        <div className="flex items-center gap-1.5">
          {item.href ? (
            <a href={item.href} className="max-w-32 truncate text-[var(--foreground-light)] transition-colors hover:text-[var(--foreground-default)] lg:max-w-64">
              {item.label}
            </a>
          ) : (
            <span className="max-w-32 truncate text-[var(--foreground-default)] lg:max-w-64">{item.label}</span>
          )}
          {item.badge}
          {item.switcher && (
            <button type="button" aria-label={`Switch ${item.label}`} className="text-[var(--foreground-lighter)] transition-colors hover:text-[var(--foreground-default)]">
              <SwitcherChevron />
            </button>
          )}
        </div>
      </div>
    ))}
  </nav>
)

export default Breadcrumb
