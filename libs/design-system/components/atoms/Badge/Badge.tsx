import type { FC, ReactNode } from 'react'

// mhtml: <div class="inline-flex items-center gap-1 justify-center rounded-full whitespace-nowrap
//   tracking-[0.07em] uppercase font-medium text-[9px] leading-none px-[5.5px] py-[3px]
//   bg-surface-75 text-foreground-light border border-strong">Free</div>
//
// mhtml (warning): same base + bg-warning/10 text-warning border-warning-500

export type BadgeVariant = 'default' | 'warning' | 'destructive' | 'brand'

export interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    'bg-[var(--background-surface-75)] text-[var(--foreground-light)] border-[var(--border-strong)]',
  warning:
    'bg-[var(--warning-default)]/10 text-[var(--warning-default)] border-[var(--warning-500)]',
  destructive:
    'bg-[var(--destructive-default)]/10 text-[var(--destructive-default)] border-[var(--destructive-default)]/50',
  brand:
    'bg-[var(--brand-500)] text-[var(--foreground-default)] border-[var(--brand-default)]/30',
}

const Badge: FC<BadgeProps> = ({ variant = 'default', children, className = '' }) => {
  return (
    <div
      className={`inline-flex items-center gap-1 justify-center rounded-full whitespace-nowrap tracking-[0.07em] uppercase font-medium text-[9px] leading-none px-[5.5px] py-[3px] border ${variantClasses[variant]} ${className}`}
    >
      {children}
    </div>
  )
}

export default Badge
