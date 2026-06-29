import type { FC, ReactNode } from 'react'

export type FormFieldProps = {
  label: string
  /** id of the associated control (for the label's htmlFor) */
  htmlFor?: string
  description?: ReactNode
  /** element next to the control (e.g. a CopyButton) */
  action?: ReactNode
  /** the form control (input, select, etc.) */
  children: ReactNode
  className?: string
}

const FormField: FC<FormFieldProps> = ({ label, htmlFor, description, action, children, className = '' }) => (
  <div className={`flex flex-col gap-2 py-4 px-4 border-b border-[var(--border-muted)] last:border-b-0 ${className}`}>
    <label htmlFor={htmlFor} className="text-sm text-[var(--foreground-default)] transition-colors">
      {label}
    </label>
    {description && (
      <p className="text-sm text-[var(--foreground-lighter)]">{description}</p>
    )}
    <div className="flex items-center gap-2">
      {children}
      {action}
    </div>
  </div>
)

export default FormField
