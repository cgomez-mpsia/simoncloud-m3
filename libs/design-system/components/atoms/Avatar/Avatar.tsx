import type { FC } from 'react'

export type AvatarProps = {
  /** Image URL; when absent, a user icon fallback is shown */
  src?: string
  alt?: string
  /** Diameter in pixels */
  size?: number
  className?: string
}

const Avatar: FC<AvatarProps> = ({ src, alt = '', size = 24, className = '' }) => (
  <div
    role="img"
    aria-label={alt}
    style={{ width: size, height: size, backgroundImage: src ? `url(${src})` : undefined }}
    className={`flex items-center justify-center shrink-0 rounded-full bg-center bg-cover bg-no-repeat bg-[var(--background-selection)] text-[var(--foreground-light)] ${className}`}
  >
    {!src && (
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    )}
  </div>
)

export default Avatar
