import { useState, type FC, type ButtonHTMLAttributes } from 'react'

export type CopyButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> & {
  /** Text to copy to the clipboard */
  value: string
  /** Button label (defaults to "Copy") */
  label?: string
}

const baseClasses =
  'relative inline-flex items-center justify-center cursor-pointer gap-1 text-center font-normal ease-out duration-200 rounded-md transition-all text-xs py-1 h-6 px-2.5 border border-[var(--border-strong)] text-[var(--foreground-light)] hover:text-[var(--foreground-default)] hover:border-[var(--border-stronger)] outline-hidden focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--brand-900)] disabled:opacity-50 disabled:pointer-events-none'

const CopyButton: FC<CopyButtonProps> = ({ value, label = 'Copy', className = '', ...props }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable: fail silently; the consumer can provide a fallback
    }
  }

  return (
    <button type="button" onClick={handleCopy} className={`${baseClasses} ${className}`} {...props}>
      <span className="truncate">{copied ? 'Copied' : label}</span>
    </button>
  )
}

export default CopyButton
