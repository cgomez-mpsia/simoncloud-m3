import type { FC, ReactNode } from 'react'

// mhtml: <a class="group text-left bg-surface-100 border border-surface rounded-md
//   flex flex-row transition ease-in-out duration-150 cursor-pointer
//   hover:bg-surface-200 hover:border-control
//   min-h-32 md:min-h-44 h-44 px-0! pt-5 pb-0 overflow-hidden relative">
//
//   <div class="flex h-full w-full flex-col space-y-2">
//     <div class="w-full flex flex-col gap-y-4 justify-between px-5">
//       <div class="flex flex-col gap-y-0.5 relative">
//         <div class="flex items-center justify-between">
//           <h5 class="text-sm shrink truncate pr-5">GuildHub</h5>
//           <div><!-- kebab menu --></div>
//         </div>
//         <p class="text-sm text-foreground-lighter">AWS | us-west-2</p>
//       </div>
//     </div>
//   </div>
//
//   <div class="w-full mt-auto!"><!-- footer (alert, etc.) --></div>
//   <div class="absolute right-4 top-4 group-hover:right-3 transition-all duration-200 ..."><!-- arrow --></div>
// </a>

export interface CardProps {
  href?: string
  header?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  action?: ReactNode
  className?: string
}

const baseClasses =
  'group text-left bg-[var(--background-surface-100)] border border-[var(--border-default)] ' +
  'rounded-md transition ease-in-out duration-150 overflow-hidden relative flex flex-col ' +
  'hover:bg-[var(--background-surface-200)] hover:border-[var(--border-control)]'

const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

const Card: FC<CardProps> = ({ href, header, children, footer, action, className = '' }) => {
  const Wrapper = href ? 'a' : 'div'
  const wrapperProps = href ? { href } : {}

  return (
    <Wrapper
      {...(wrapperProps as Record<string, string>)}
      className={`${baseClasses} ${className}`}
    >
      {/* Top-right arrow indicator — only when clickable */}
      {href && (
        <div className="absolute right-4 top-4 text-[var(--foreground-lighter)] transition-all duration-200 group-hover:right-3 group-hover:text-[var(--foreground-default)]">
          <ArrowIcon />
        </div>
      )}

      {/* Top-right action slot (e.g. kebab menu button) */}
      {action && (
        <div className="absolute right-4 top-4 z-10">{action}</div>
      )}

      {/* Header */}
      {header && (
        <div className="w-full px-5 pt-5 pb-0">{header}</div>
      )}

      {/* Body */}
      {children && (
        <div className="w-full flex-1 px-5 py-3">{children}</div>
      )}

      {/* Footer — pinned to bottom */}
      {footer && (
        <div className="w-full mt-auto">{footer}</div>
      )}
    </Wrapper>
  )
}

export default Card
