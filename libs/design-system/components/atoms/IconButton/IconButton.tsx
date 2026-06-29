import type { ButtonHTMLAttributes, FC, ReactNode } from 'react'

export type IconButtonVariant = 'ghost' | 'outline'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  children: ReactNode
  /** 'ghost' (default): square, borderless. 'outline': circular with border (header style). */
  variant?: IconButtonVariant
  className?: string
}

const baseClasses =
  'inline-flex items-center justify-center transition-colors outline-hidden focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--brand-900)] disabled:opacity-50 disabled:pointer-events-none'

const variantClasses: Record<IconButtonVariant, string> = {
  ghost:
    'rounded-md p-2 bg-transparent text-[var(--foreground-lighter)] hover:bg-[var(--background-overlay)] hover:text-[var(--foreground-light)]',
  // Circular bordered button used in the dashboard header (from the real Supabase markup)
  outline:
    'rounded-full border border-[var(--border-strong)] h-7 w-7 bg-transparent text-[var(--foreground-light)] hover:text-[var(--foreground-default)] hover:border-[var(--border-stronger)]',
}

const IconButton: FC<IconButtonProps> = ({ label, children, variant = 'ghost', className = '', ...props }) => (
  <button
    aria-label={label}
    className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    {...props}
  >
    {children}
  </button>
)

export default IconButton
