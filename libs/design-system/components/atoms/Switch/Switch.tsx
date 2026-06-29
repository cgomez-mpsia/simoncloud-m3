import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import * as RSwitch from '@radix-ui/react-switch'

export type SwitchProps = ComponentPropsWithoutRef<typeof RSwitch.Root>

// Radix handles the toggle behavior/accessibility; the checked track uses the
// brand token (green canonical, blue when a tenant overrides --brand-*).
const Switch = forwardRef<ElementRef<typeof RSwitch.Root>, SwitchProps>(
  ({ className = '', ...props }, ref) => (
    <RSwitch.Root
      ref={ref}
      className={`peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-[var(--background-surface-300)] outline-hidden transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-900)] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--brand-500)] ${className}`}
      {...props}
    >
      <RSwitch.Thumb className="pointer-events-none block h-4 w-4 translate-x-0.5 rounded-full bg-[var(--foreground-default)] shadow-sm transition-transform data-[state=checked]:translate-x-[18px]" />
    </RSwitch.Root>
  ),
)

Switch.displayName = 'Switch'

export default Switch
