import type { AnchorHTMLAttributes, ButtonHTMLAttributes, FC, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'default' | 'outline' | 'ghost'
type ButtonSize = 'tiny' | 'small' | 'medium' | 'large'

type BaseProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  className?: string
}

type AsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never
  }

type AsAnchor = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
  }

export type ButtonProps = AsButton | AsAnchor

const sizeClasses: Record<ButtonSize, string> = {
  tiny: 'px-2.5 py-1 h-[26px] text-xs',
  small: 'px-3 py-1.5 text-sm',
  medium: 'px-4 py-2 text-sm',
  large: 'px-6 py-3 text-base',
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--brand-500)] hover:bg-[var(--brand-500-hover)] text-[var(--foreground-default)] border border-[var(--brand-900)]/30 hover:border-[var(--brand-900)] focus-visible:outline-[var(--brand-900)]',
  default:
    'bg-[var(--background-muted)] hover:bg-[var(--background-selection)] text-[var(--foreground-default)] border border-[var(--border-strong)] hover:border-[var(--border-stronger)] focus-visible:outline-[var(--brand-900)]',
  outline:
    'bg-transparent text-[var(--foreground-default)] border border-[var(--border-strong)] hover:border-[var(--border-stronger)] focus-visible:outline-[var(--border-stronger)]',
  ghost:
    'bg-transparent text-[var(--foreground-lighter)] hover:text-[var(--foreground-default)] hover:bg-[var(--background-surface-200)] border border-transparent focus-visible:outline-[var(--border-default)]',
}

const baseClasses =
  'relative inline-flex items-center justify-center gap-2 rounded-md font-normal transition-all duration-200 ease-out outline-hidden focus-visible:outline-4 focus-visible:outline-offset-1 cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none'

const Button: FC<ButtonProps> = ({
  variant = 'default',
  size = 'medium',
  children,
  className = '',
  ...props
}) => {
  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`

  if ('href' in props && props.href !== undefined) {
    const { href, ...anchorProps } = props as AsAnchor
    return (
      <a href={href} className={classes} {...anchorProps}>
        <span className="truncate">{children}</span>
      </a>
    )
  }

  const buttonProps = props as AsButton
  return (
    <button className={classes} {...buttonProps}>
      <span className="truncate">{children}</span>
    </button>
  )
}

export default Button
