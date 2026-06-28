import type { FC, ReactNode } from 'react'

export interface SectionHeaderProps {
  label?: string
  title: ReactNode
  description?: ReactNode
  className?: string
}

// mhtml: <div class="... w-full text-center flex flex-col items-center">
//   <h2 class="h2">Title</h2>
//   <p class="p max-w-xl">Description</p>
// </div>
// .h2 uses font-size: inherit — sizing set by context (text-3xl / text-4xl in practice)
const SectionHeader: FC<SectionHeaderProps> = ({ label, title, description, className = '' }) => {
  return (
    <div className={`w-full text-center flex flex-col items-center gap-4 ${className}`}>
      {label && (
        <span className="text-[var(--foreground-lighter)] block font-mono text-xs uppercase tracking-widest">
          {label}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-semibold text-[var(--foreground-default)] max-w-2xl">
        {title}
      </h2>
      {description && (
        <p className="text-[var(--foreground-light)] max-w-xl text-lg">
          {description}
        </p>
      )}
    </div>
  )
}

export default SectionHeader
