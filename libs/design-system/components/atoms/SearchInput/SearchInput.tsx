import type { FC, InputHTMLAttributes, ReactNode } from 'react'

export type SearchInputProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Optional shortcut hint shown on the right (e.g. ⌘K) */
  shortcut?: ReactNode
}

const SearchIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-[var(--foreground-lighter)]"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const SearchInput: FC<SearchInputProps> = ({ className = '', placeholder = 'Search...', shortcut, ...props }) => (
  <div className={`relative flex items-center ${className}`}>
    <span className="pointer-events-none absolute left-2.5 flex items-center">
      <SearchIcon />
    </span>
    <input
      type="text"
      placeholder={placeholder}
      className="h-7 w-full rounded-md border border-[var(--border-control)] bg-[var(--background-surface-200)] pl-8 pr-12 text-xs text-[var(--foreground-default)] placeholder:text-[var(--foreground-lighter)] outline-hidden focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--brand-900)]"
      {...props}
    />
    {shortcut && (
      <span className="pointer-events-none absolute right-2 rounded border border-[var(--border-strong)] px-1.5 py-0.5 text-[10px] text-[var(--foreground-lighter)]">
        {shortcut}
      </span>
    )}
  </div>
)

export default SearchInput
