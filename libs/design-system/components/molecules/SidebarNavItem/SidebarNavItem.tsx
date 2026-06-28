import type { FC, ReactNode } from 'react'

// mhtml: <li data-sidebar="menu-item" class="group/menu-item relative">
//   <a data-sidebar="menu-button" data-active="true" data-has-icon="true"
//      class="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md
//             py-2 px-2 text-left text-sm h-8 text-foreground-lighter
//             data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-foreground
//             hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground
//             [&>svg]:size-5 [&>svg]:shrink-0 [&>span:last-child]:truncate
//             transition-[width,height,padding]">
//     <svg .../>
//     <span>Projects</span>
//   </a>
// </li>
//
// --sidebar-accent = var(--background-selection)
// --sidebar-accent-foreground = var(--foreground-default)

export interface SidebarNavItemProps {
  href: string
  icon?: ReactNode
  label: string
  active?: boolean
  className?: string
}

const linkClasses =
  'flex w-full items-center gap-2 overflow-hidden rounded-md py-2 px-2 text-left text-sm h-8 ' +
  'text-[var(--foreground-lighter)] transition-[width,height,padding] ' +
  'hover:bg-[var(--background-selection)]/50 hover:text-[var(--foreground-default)] ' +
  'data-[active=true]:bg-[var(--background-selection)] data-[active=true]:font-medium data-[active=true]:text-[var(--foreground-default)] ' +
  '[&>svg]:size-5 [&>svg]:shrink-0 [&>span:last-child]:truncate'

const SidebarNavItem: FC<SidebarNavItemProps> = ({
  href,
  icon,
  label,
  active = false,
  className = '',
}) => {
  return (
    <li className="group/menu-item relative list-none">
      <a
        href={href}
        data-active={active ? 'true' : 'false'}
        className={`${linkClasses} ${className}`}
      >
        {icon}
        <span>{label}</span>
      </a>
    </li>
  )
}

export default SidebarNavItem
