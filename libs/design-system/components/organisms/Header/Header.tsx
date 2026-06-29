import type { FC, ReactNode } from 'react'
import Logo from '../../atoms/Logo'
import SearchInput from '../../atoms/SearchInput'
import Avatar from '../../atoms/Avatar'
import IconButton from '../../atoms/IconButton'
import Breadcrumb, { type BreadcrumbItem } from '../../molecules/Breadcrumb'

export type HeaderProps = {
  /** Breadcrumb segments (org / project / branch …) */
  breadcrumb?: BreadcrumbItem[]
  /** Primary action on the left (e.g. an upload Button) */
  primaryAction?: ReactNode
  /** Right-side text link */
  headerLink?: ReactNode
  searchPlaceholder?: string
  /** Avatar image URL; falls back to a user icon */
  avatarSrc?: string
  /** Home link target for the logo */
  homeHref?: string
  className?: string
}

const HelpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
)

const IdeaIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
)

// Supabase dashboard top bar, recreated from the real markup (manifests
// supabase-auth-users / supabase-auth-emails). Brand-action colors follow tokens.
const Header: FC<HeaderProps> = ({
  breadcrumb = [],
  primaryAction,
  headerLink,
  searchPlaceholder = 'Search...',
  avatarSrc,
  homeHref = '/',
  className = '',
}) => (
  <header className={`flex h-12 shrink-0 items-center border-b border-[var(--border-default)] bg-[var(--background-default)] ${className}`}>
    <div className="flex h-full flex-1 items-center justify-between gap-x-8 overflow-x-auto pl-4 pr-3">
      <div className="flex items-center gap-3">
        <a href={homeHref} aria-label="Home" className="flex items-center">
          <Logo size={24} />
        </a>
        {breadcrumb.length > 0 && (
          <>
            <span className="text-[var(--foreground-muted)]">/</span>
            <Breadcrumb items={breadcrumb} />
          </>
        )}
        {primaryAction}
      </div>

      <div className="flex items-center gap-2">
        {headerLink}
        <SearchInput className="w-56" placeholder={searchPlaceholder} shortcut="⌘K" />
        <IconButton variant="outline" label="Help">
          <HelpIcon />
        </IconButton>
        <IconButton variant="outline" label="Ideas">
          <IdeaIcon />
        </IconButton>
        <Avatar src={avatarSrc} size={28} alt="User" />
      </div>
    </div>
  </header>
)

export default Header
