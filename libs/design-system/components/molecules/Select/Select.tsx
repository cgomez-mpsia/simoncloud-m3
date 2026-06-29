import type { FC, ReactNode } from 'react'
import * as RSelect from '@radix-ui/react-select'

export type SelectOption = { value: string; label: ReactNode }

export type SelectProps = {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  'aria-label'?: string
}

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const Check = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

// Convenience Select built on Radix; trigger/content styled from the real
// Supabase filter dropdowns (manifest supabase-logs) mapped to tokens.
const Select: FC<SelectProps> = ({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Select…',
  disabled,
  className = '',
  'aria-label': ariaLabel,
}) => (
  <RSelect.Root value={value} defaultValue={defaultValue} onValueChange={onValueChange} disabled={disabled}>
    <RSelect.Trigger
      aria-label={ariaLabel}
      className={`inline-flex h-8 items-center justify-between gap-2 rounded-md border border-[var(--border-strong)] bg-[var(--background-alternative)] px-2.5 text-xs text-[var(--foreground-default)] outline-hidden transition-colors hover:border-[var(--border-stronger)] hover:bg-[var(--background-selection)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--brand-900)] disabled:cursor-not-allowed disabled:opacity-50 data-[state=open]:bg-[var(--background-selection)] ${className}`}
    >
      <RSelect.Value placeholder={placeholder} />
      <RSelect.Icon className="text-[var(--foreground-lighter)]">
        <ChevronDown />
      </RSelect.Icon>
    </RSelect.Trigger>
    <RSelect.Portal>
      <RSelect.Content
        position="popper"
        sideOffset={6}
        className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-[var(--border-default)] bg-[var(--background-overlay)] p-1 shadow-lg"
      >
        <RSelect.Viewport>
          {options.map((o) => (
            <RSelect.Item
              key={o.value}
              value={o.value}
              className="relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-3 text-sm text-[var(--foreground-light)] outline-hidden transition-colors data-[highlighted]:bg-[var(--background-surface-300)] data-[highlighted]:text-[var(--foreground-default)] data-[state=checked]:text-[var(--foreground-default)]"
            >
              <span className="absolute left-2 flex items-center">
                <RSelect.ItemIndicator>
                  <Check />
                </RSelect.ItemIndicator>
              </span>
              <RSelect.ItemText>{o.label}</RSelect.ItemText>
            </RSelect.Item>
          ))}
        </RSelect.Viewport>
      </RSelect.Content>
    </RSelect.Portal>
  </RSelect.Root>
)

export default Select
