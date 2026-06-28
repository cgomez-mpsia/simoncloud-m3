import type { FC, ReactNode } from 'react'

// mhtml: <div role="alert" class="w-full p-5 pb-5 flex flex-row gap-x-2 items-center">
//   <div class="shrink-0 w-6 h-6 border rounded-md flex items-center justify-center
//               border-strong [&>svg]:text-foreground">
//     <svg><!-- icon --></svg>
//   </div>
//   <div class="flex items-center w-full gap-x-2">
//     <p class="text-xs">Project is paused</p>
//     <button><!-- optional action --></button>
//   </div>
// </div>

export interface AlertProps {
  icon?: ReactNode
  children: ReactNode
  action?: ReactNode
  className?: string
}

const Alert: FC<AlertProps> = ({ icon, children, action, className = '' }) => {
  return (
    <div
      role="alert"
      className={`w-full p-5 pb-5 flex flex-row gap-x-2 items-center ${className}`}
    >
      {icon && (
        <div className="shrink-0 w-6 h-6 border rounded-md flex items-center justify-center border-[var(--border-strong)] [&>svg]:text-[var(--foreground-default)]">
          {icon}
        </div>
      )}
      <div className="flex items-center w-full gap-x-2">
        <p className="text-xs text-[var(--foreground-default)]">{children}</p>
        {action}
      </div>
    </div>
  )
}

export default Alert
