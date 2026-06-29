import type { FC } from 'react'

export type LogoProps = {
  /** Width and height in pixels (square) */
  size?: number
  className?: string
  title?: string
}

// SimonCloud cloud mark. Colors come from brand tokens so the logo follows the
// active brand (green canonical, blue when a tenant overrides --brand-*).
const Logo: FC<LogoProps> = ({ size = 26, className = '', title = 'SimonCloud' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label={title}
    className={className}
  >
    <path
      d="M18.9583 20.5833H9.74997C8.34366 20.5829 6.96514 20.1915 5.76848 19.4528C4.57181 18.7141 3.60413 17.6572 2.97358 16.4001C2.34303 15.1431 2.07444 13.7355 2.19783 12.3346C2.32122 10.9337 2.83173 9.59473 3.6723 8.46727C4.51288 7.33982 5.65042 6.46832 6.95779 5.95015C8.26516 5.43199 9.69087 5.28757 11.0756 5.53305C12.4603 5.77852 13.7495 6.40421 14.7991 7.3402C15.8487 8.27619 16.6173 9.4856 17.0191 10.8333H18.9583C20.2512 10.8333 21.4912 11.3469 22.4054 12.2612C23.3197 13.1754 23.8333 14.4154 23.8333 15.7083C23.8333 17.0012 23.3197 18.2412 22.4054 19.1554C21.4912 20.0697 20.2512 20.5833 18.9583 20.5833Z"
      fill="var(--brand-500)"
      stroke="var(--brand-default)"
      strokeOpacity="0.3"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default Logo
