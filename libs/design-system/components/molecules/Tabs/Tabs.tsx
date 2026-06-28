import * as RadixTabs from '@radix-ui/react-tabs'
import type { FC, ReactNode } from 'react'

// mhtml: <div role="tablist" class="relative w-full col-span-full flex justify-center gap-2">
//   <button aria-selected="true" role="tab"
//     class="py-1.5 px-3 lg:py-2 lg:px-8 border rounded-full bg-alternative text-sm
//            transition-all hover:border-foreground-lighter hover:text-foreground
//            opacity-100 border-foreground!">
//     Table Editor
//   </button>
//   <button aria-selected="false" role="tab"
//     class="py-1.5 px-3 lg:py-2 lg:px-8 border rounded-full bg-alternative text-sm
//            opacity-80 transition-all hover:border-foreground-lighter hover:text-foreground">
//     SQL Editor
//   </button>
// </div>

export interface TabItem {
  value: string
  label: string
  content: ReactNode
}

export interface TabsProps {
  items: TabItem[]
  defaultValue?: string
  className?: string
}

const triggerClasses =
  'py-1.5 px-3 lg:py-2 lg:px-8 border rounded-full ' +
  'bg-[var(--background-alternative)] text-[var(--foreground-default)] text-sm cursor-pointer ' +
  'transition-all hover:border-[var(--foreground-lighter)] hover:text-[var(--foreground-default)] ' +
  'data-[state=active]:opacity-100 data-[state=active]:border-[var(--foreground-default)] ' +
  'data-[state=inactive]:opacity-80 data-[state=inactive]:border-[var(--border-default)]'

const Tabs: FC<TabsProps> = ({ items, defaultValue, className = '' }) => {
  const initial = defaultValue ?? items[0]?.value

  return (
    <RadixTabs.Root defaultValue={initial} className={`w-full ${className}`}>
      <RadixTabs.List className="relative w-full flex justify-center gap-2 mb-6">
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.value}
            value={item.value}
            className={triggerClasses}
          >
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>

      {items.map((item) => (
        <RadixTabs.Content key={item.value} value={item.value}>
          {item.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  )
}

export default Tabs
