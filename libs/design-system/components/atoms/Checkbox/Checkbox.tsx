import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import * as RCheckbox from '@radix-ui/react-checkbox'

export type CheckboxProps = ComponentPropsWithoutRef<typeof RCheckbox.Root>

// Radix handles the accessible checkbox behavior; styling comes from the real
// Supabase classes (manifest supabase-auth-users) mapped to our tokens.
const Checkbox = forwardRef<ElementRef<typeof RCheckbox.Root>, CheckboxProps>(
  ({ className = '', ...props }, ref) => (
    <RCheckbox.Root
      ref={ref}
      className={`peer flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-[var(--border-control)] bg-[var(--background-muted)] transition-colors hover:border-[var(--border-strong)] outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-900)] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--foreground-default)] data-[state=checked]:text-[var(--foreground-contrast)] ${className}`}
      {...props}
    >
      <RCheckbox.Indicator>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </RCheckbox.Indicator>
    </RCheckbox.Root>
  ),
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
