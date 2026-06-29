import type { FC, InputHTMLAttributes } from 'react'

export type TextInputProps = InputHTMLAttributes<HTMLInputElement>

const baseClasses =
  'flex w-full rounded-md border border-[var(--border-control)] read-only:border-[var(--border-strong)] bg-[var(--background-surface-200)] py-2 px-3 text-sm text-[var(--foreground-default)] transition-colors placeholder:text-[var(--foreground-muted)] outline-hidden focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--brand-900)] disabled:cursor-not-allowed disabled:opacity-50'

const TextInput: FC<TextInputProps> = ({ className = '', type = 'text', ...props }) => (
  <input type={type} className={`${baseClasses} ${className}`} {...props} />
)

export default TextInput
