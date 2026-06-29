import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type FC, type HTMLAttributes } from 'react'
import * as RDialog from '@radix-ui/react-dialog'

// Radix Dialog provides the accessible modal behavior (focus trap, Esc, portal);
// styling comes from the real Supabase modal markup (manifest supabase-storage-files).

export const Modal = RDialog.Root
export const ModalTrigger = RDialog.Trigger
export const ModalClose = RDialog.Close

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export const ModalContent = forwardRef<
  ElementRef<typeof RDialog.Content>,
  ComponentPropsWithoutRef<typeof RDialog.Content>
>(({ className = '', children, ...props }, ref) => (
  <RDialog.Portal>
    <RDialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
    <RDialog.Content
      ref={ref}
      className={`fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[var(--border-default)] bg-[var(--background-surface-100)] shadow-xl outline-hidden ${className}`}
      {...props}
    >
      {children}
      <RDialog.Close
        aria-label="Close"
        className="absolute right-3 top-3 rounded-md p-1 text-[var(--foreground-lighter)] outline-hidden transition-colors hover:text-[var(--foreground-default)] focus-visible:outline-2 focus-visible:outline-[var(--brand-900)]"
      >
        <CloseIcon />
      </RDialog.Close>
    </RDialog.Content>
  </RDialog.Portal>
))
ModalContent.displayName = 'ModalContent'

export const ModalHeader: FC<HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => (
  <div className={`flex flex-col gap-1 border-b border-[var(--border-muted)] px-5 py-4 ${className}`} {...props} />
)

export const ModalTitle = forwardRef<
  ElementRef<typeof RDialog.Title>,
  ComponentPropsWithoutRef<typeof RDialog.Title>
>(({ className = '', ...props }, ref) => (
  <RDialog.Title ref={ref} className={`text-base font-medium text-[var(--foreground-default)] ${className}`} {...props} />
))
ModalTitle.displayName = 'ModalTitle'

export const ModalDescription = forwardRef<
  ElementRef<typeof RDialog.Description>,
  ComponentPropsWithoutRef<typeof RDialog.Description>
>(({ className = '', ...props }, ref) => (
  <RDialog.Description ref={ref} className={`text-sm text-[var(--foreground-lighter)] ${className}`} {...props} />
))
ModalDescription.displayName = 'ModalDescription'

export const ModalBody: FC<HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => (
  <div className={`px-5 py-4 ${className}`} {...props} />
)

export const ModalFooter: FC<HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => (
  <div className={`flex items-center justify-end gap-2 border-t border-[var(--border-muted)] px-5 py-4 ${className}`} {...props} />
)
