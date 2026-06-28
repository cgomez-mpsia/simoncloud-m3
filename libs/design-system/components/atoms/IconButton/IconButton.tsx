import type { ButtonHTMLAttributes, FC, ReactNode } from 'react'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  children: ReactNode
  className?: string
}

// From mhtml: bg-transparent hover:bg-overlay hover:text-foreground-light
// text-foreground-lighter inline-flex items-center justify-center rounded-md p-2
// focus:ring-brand focus:ring-2 focus:ring-inset focus:outline-hidden
const IconButton: FC<IconButtonProps> = ({ label, children, className = '', ...props }) => {
  return (
    <button
      aria-label={label}
      className={`
        inline-flex items-center justify-center rounded-md p-2
        bg-transparent text-[var(--foreground-lighter)]
        hover:bg-[var(--background-overlay)] hover:text-[var(--foreground-light)]
        transition-colors
        focus:outline-hidden focus:ring-2 focus:ring-inset focus:ring-[var(--brand-900)]
        disabled:opacity-50 disabled:pointer-events-none
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {children}
    </button>
  )
}

export default IconButton
