import type { FC, ReactNode } from 'react'

export interface AvatarLogoProps {
  href: string
  name: string
  children: ReactNode
  className?: string
}

// mhtml: <a class="transition-opacity group" href="...">
//   <div class="m-1 bg-(--color-bg-darkest) h-16 w-16 flex items-center justify-center
//               rounded-md group-hover:border transition-all text-foreground-light
//               border-foreground-light hover:shadow-sm">
//     <svg width="45" height="45">...</svg>
//   </div>
// </a>
const AvatarLogo: FC<AvatarLogoProps> = ({ href, name, children, className = '' }) => {
  return (
    <a
      href={href}
      aria-label={name}
      title={name}
      className={`transition-opacity group ${className}`}
    >
      <div
        className="
          m-1 h-16 w-16 flex items-center justify-center rounded-md
          bg-[var(--background-default)]
          text-[var(--foreground-light)] border-[var(--foreground-light)]
          group-hover:border transition-all hover:shadow-sm
        "
      >
        {children}
      </div>
    </a>
  )
}

export default AvatarLogo
