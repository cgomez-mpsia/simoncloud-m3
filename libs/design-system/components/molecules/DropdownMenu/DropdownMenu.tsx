import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import * as RDropdown from '@radix-ui/react-dropdown-menu'

// Radix provides the menu behavior/accessibility (focus, keyboard, portal);
// every part is styled with Supabase dark tokens (shadcn-style composition).

export const DropdownMenu = RDropdown.Root
export const DropdownMenuTrigger = RDropdown.Trigger
export const DropdownMenuGroup = RDropdown.Group
export const DropdownMenuRadioGroup = RDropdown.RadioGroup

export const DropdownMenuContent = forwardRef<
  ElementRef<typeof RDropdown.Content>,
  ComponentPropsWithoutRef<typeof RDropdown.Content>
>(({ className = '', sideOffset = 6, ...props }, ref) => (
  <RDropdown.Portal>
    <RDropdown.Content
      ref={ref}
      sideOffset={sideOffset}
      className={`z-50 min-w-56 overflow-hidden rounded-md border border-[var(--border-default)] bg-[var(--background-overlay)] p-1 shadow-lg ${className}`}
      {...props}
    />
  </RDropdown.Portal>
))
DropdownMenuContent.displayName = 'DropdownMenuContent'

export const DropdownMenuItem = forwardRef<
  ElementRef<typeof RDropdown.Item>,
  ComponentPropsWithoutRef<typeof RDropdown.Item> & { inset?: boolean }
>(({ className = '', inset = false, ...props }, ref) => (
  <RDropdown.Item
    ref={ref}
    className={`relative flex cursor-pointer select-none items-center gap-3 rounded-sm px-3 py-2 text-sm text-[var(--foreground-light)] outline-hidden transition-colors data-[highlighted]:bg-[var(--background-surface-300)] data-[highlighted]:text-[var(--foreground-default)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${inset ? 'pl-8' : ''} ${className}`}
    {...props}
  />
))
DropdownMenuItem.displayName = 'DropdownMenuItem'

export const DropdownMenuLabel = forwardRef<
  ElementRef<typeof RDropdown.Label>,
  ComponentPropsWithoutRef<typeof RDropdown.Label>
>(({ className = '', ...props }, ref) => (
  <RDropdown.Label ref={ref} className={`px-3 py-1.5 text-xs text-[var(--foreground-lighter)] ${className}`} {...props} />
))
DropdownMenuLabel.displayName = 'DropdownMenuLabel'

export const DropdownMenuSeparator = forwardRef<
  ElementRef<typeof RDropdown.Separator>,
  ComponentPropsWithoutRef<typeof RDropdown.Separator>
>(({ className = '', ...props }, ref) => (
  <RDropdown.Separator ref={ref} className={`my-1 h-px bg-[var(--border-default)] ${className}`} {...props} />
))
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator'

export const DropdownMenuRadioItem = forwardRef<
  ElementRef<typeof RDropdown.RadioItem>,
  ComponentPropsWithoutRef<typeof RDropdown.RadioItem>
>(({ className = '', children, ...props }, ref) => (
  <RDropdown.RadioItem
    ref={ref}
    className={`relative flex cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-3 text-sm text-[var(--foreground-light)] outline-hidden transition-colors data-[highlighted]:bg-[var(--background-surface-300)] data-[highlighted]:text-[var(--foreground-default)] ${className}`}
    {...props}
  >
    <span className="absolute left-3 flex items-center justify-center">
      <RDropdown.ItemIndicator>
        <span className="h-2 w-2 rounded-full bg-[var(--foreground-default)]" />
      </RDropdown.ItemIndicator>
    </span>
    {children}
  </RDropdown.RadioItem>
))
DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem'
