import { type FC, type ReactNode, useState } from 'react'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import Button from '../../atoms/Button'
import IconButton from '../../atoms/IconButton'

export interface NavDropdownItem {
  label: string
  href: string
  description?: string
  icon?: ReactNode
}

export interface NavItem {
  label: string
  href?: string
  children?: NavDropdownItem[]
}

export interface NavbarProps {
  logo?: ReactNode
  items?: NavItem[]
  githubStars?: string
  githubUrl?: string
  signInHref?: string
  ctaLabel?: string
  ctaHref?: string
  className?: string
}

// mhtml: <nav class="relative z-40 border-default border-b backdrop-blur-xs transition-all duration-300">
// inner: <div class="relative flex justify-between h-16 mx-auto lg:container lg:px-16 xl:px-20">
// trigger: "border-transparent text-base md:text-sm leading-4 py-2 bg-transparent! hover:text-brand-link data-open:text-brand-link! px-2 h-auto"
// github badge: "border-transparent text-xs px-2.5 py-1 h-[26px] hidden group lg:flex text-foreground-light hover:text-foreground hover:bg-surface-300"
// sign in: "text-foreground bg-muted hover:bg-selection border-strong hover:border-stronger text-xs px-2.5 py-1 h-[26px] hidden lg:block"
// start: "bg-brand-500 hover:bg-brand/50 text-foreground border-brand/30 hover:border-brand text-xs px-2.5 py-1 h-[26px] hidden lg:block"
// mobile hamburger: div "inset-y-0 flex mr-2 items-center px-4 lg:hidden"

const DEFAULT_ITEMS: NavItem[] = [
  { label: 'Product', children: [] },
  { label: 'Developers', children: [] },
  { label: 'Solutions', children: [] },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Docs', href: '/docs' },
  { label: 'Blog', href: '/blog' },
]

const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="relative top-px ml-1 transition duration-200 group-data-[state=open]:rotate-180"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 17 17"
    fill="none"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.5 2.22168C5.23369 2.22168 2.58496 4.87398 2.58496 8.14677C2.58496 10.7596 4.2321 12.9799 6.55543 13.7589C6.84481 13.8109 6.95062 13.6352 6.95062 13.4827C6.95062 13.2887 6.94355 12.6493 6.94355 11.8579C6.94355 11.8579 5.07452 12.2564 4.72621 10.4542C4.72621 10.4542 4.72621 10.4542 4.41744 10.4542C4.41744 10.4542 4.99534 10.4471 5.33486 10.0804C5.33486 10.0804 4.99534 10.0875 4.72621 7.83683C4.72621 7.19031 4.95689 6.66092 5.33486 6.24686C5.27394 6.09721 5.07105 5.49447 5.39283 4.67938C5.39283 4.67938 5.88969 4.51967 7.01947 5.28626C7.502 5.15466 7.99985 5.08763 8.5 5.08692C9.00278 5.08929 9.50851 5.15495 9.98113 5.28626C11.1103 4.51967 11.606 4.67879 11.606 4.67879C11.9289 5.49447 11.7255 6.09721 11.6651 6.24686C12.0437 6.66092 12.2732 7.19031 12.2732 7.83683C12.2732 10.1129 10.8897 10.6139 9.5724 10.7606C9.78475 10.9434 9.97344 11.3048 9.97344 11.8579C9.97344 12.6493 9.96634 13.2887 9.96634 13.4827C9.96634 13.6413 10.0728 13.8258 10.3733 13.7678C11.5512 13.3728 12.5751 12.6175 13.3003 11.6089C14.0256 10.6002 14.4155 9.38912 14.415 8.14677C14.415 4.87398 11.7663 2.22168 8.5 2.22168Z"
      fill="currentColor"
    />
  </svg>
)

const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    aria-hidden="true"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

// mhtml: <svg viewBox="0 0 581 113" width="124" height="24" aria-label="Supabase Logo">
// Full wordmark SVG — 8 text paths (s·u·p·a·b·a·s·e) + 3 icon paths (lightning bolt)
const SupabaseLogo = () => (
  <svg
    viewBox="0 0 581 113"
    fill="none"
    width="124"
    height="24"
    aria-label="Supabase Logo"
    role="img"
  >
    {/* wordmark: supabase */}
    <path d="M151.397 66.7608C151.996 72.3621 157.091 81.9642 171.877 81.9642C184.764 81.9642 190.959 73.7624 190.959 65.7607C190.959 58.559 186.063 52.6577 176.373 50.6571L169.379 49.1569C166.682 48.6568 164.884 47.1565 164.884 44.7559C164.884 41.9552 167.681 39.8549 171.178 39.8549C176.772 39.8549 178.87 43.5556 179.27 46.4564L190.359 43.9558C189.76 38.6546 185.064 29.7527 171.078 29.7527C160.488 29.7527 152.696 37.0543 152.696 45.8561C152.696 52.7576 156.991 58.4591 166.482 60.5594L172.976 62.0598C176.772 62.8599 178.271 64.6605 178.271 66.8609C178.271 69.4615 176.173 71.762 171.777 71.762C165.983 71.762 163.085 68.1611 162.786 64.2602L151.397 66.7608Z" fill="currentColor" />
    <path d="M233.421 80.4639H246.109C245.909 78.7635 245.609 75.3628 245.609 71.5618V31.2529H232.321V59.8592C232.321 65.5606 228.925 69.5614 223.031 69.5614C216.837 69.5614 214.039 65.1604 214.039 59.6592V31.2529H200.752V62.3599C200.752 73.0622 207.545 81.7642 219.434 81.7642C224.628 81.7642 230.325 79.7638 233.022 75.1627C233.022 77.1631 233.221 79.4636 233.421 80.4639Z" fill="currentColor" />
    <path d="M273.076 99.4682V75.663C275.473 78.9636 280.469 81.6644 287.263 81.6644C301.149 81.6644 310.439 70.6617 310.439 55.7584C310.439 41.1553 302.148 30.1528 287.762 30.1528C280.37 30.1528 274.875 33.4534 272.677 37.2544V31.253H259.79V99.4682H273.076ZM297.352 55.8585C297.352 64.6606 291.958 69.7616 285.164 69.7616C278.372 69.7616 272.877 64.5605 272.877 55.8585C272.877 47.1566 278.372 42.0554 285.164 42.0554C291.958 42.0554 297.352 47.1566 297.352 55.8585Z" fill="currentColor" />
    <path d="M317.964 67.0609C317.964 74.7627 324.357 81.8643 334.848 81.8643C342.139 81.8643 346.835 78.4634 349.332 74.5625C349.332 76.463 349.532 79.1635 349.832 80.4639H362.02C361.72 78.7635 361.422 75.2627 361.422 72.6622V48.4567C361.422 38.5545 355.627 29.7527 340.043 29.7527C326.855 29.7527 319.761 38.2544 318.963 45.9562L330.751 48.4567C331.151 44.1558 334.348 40.455 340.141 40.455C345.737 40.455 348.434 43.3556 348.434 46.8564C348.434 48.5568 347.536 49.9572 344.738 50.3572L332.65 52.1576C324.458 53.3579 317.964 58.2589 317.964 67.0609ZM337.644 71.962C333.349 71.962 331.25 69.1614 331.25 66.2608C331.25 62.4599 333.947 60.5594 337.345 60.0594L348.434 58.359V60.5594C348.434 69.2615 343.239 71.962 337.644 71.962Z" fill="currentColor" />
    <path d="M387.703 80.4641V74.4627C390.299 78.6637 395.494 81.6644 402.288 81.6644C416.276 81.6644 425.467 70.5618 425.467 55.6585C425.467 41.0552 417.174 29.9528 402.788 29.9528C395.494 29.9528 390.1 33.1535 387.902 36.6541V8.04785H374.815V80.4641H387.703ZM412.178 55.7584C412.178 64.7605 406.784 69.7616 399.99 69.7616C393.297 69.7616 387.703 64.6606 387.703 55.7584C387.703 46.7564 393.297 41.8554 399.99 41.8554C406.784 41.8554 412.178 46.7564 412.178 55.7584Z" fill="currentColor" />
    <path d="M432.99 67.0609C432.99 74.7627 439.383 81.8643 449.873 81.8643C457.165 81.8643 461.862 78.4634 464.358 74.5625C464.358 76.463 464.559 79.1635 464.858 80.4639H477.046C476.748 78.7635 476.448 75.2627 476.448 72.6622V48.4567C476.448 38.5545 470.653 29.7527 455.068 29.7527C441.881 29.7527 434.788 38.2544 433.989 45.9562L445.776 48.4567C446.177 44.1558 449.374 40.455 455.167 40.455C460.763 40.455 463.46 43.3556 463.46 46.8564C463.46 48.5568 462.561 49.9572 459.763 50.3572L447.676 52.1576C439.484 53.3579 432.99 58.2589 432.99 67.0609ZM452.671 71.962C448.375 71.962 446.276 69.1614 446.276 66.2608C446.276 62.4599 448.973 60.5594 452.371 60.0594L463.46 58.359V60.5594C463.46 69.2615 458.265 71.962 452.671 71.962Z" fill="currentColor" />
    <path d="M485.645 66.7608C486.243 72.3621 491.339 81.9642 506.124 81.9642C519.012 81.9642 525.205 73.7624 525.205 65.7607C525.205 58.559 520.311 52.6577 510.62 50.6571L503.626 49.1569C500.929 48.6568 499.132 47.1565 499.132 44.7559C499.132 41.9552 501.928 39.8549 505.425 39.8549C511.021 39.8549 513.118 43.5556 513.519 46.4564L524.607 43.9558C524.007 38.6546 519.312 29.7527 505.326 29.7527C494.735 29.7527 486.944 37.0543 486.944 45.8561C486.944 52.7576 491.238 58.4591 500.73 60.5594L507.224 62.0598C511.021 62.8599 512.519 64.6605 512.519 66.8609C512.519 69.4615 510.421 71.762 506.025 71.762C500.23 71.762 497.334 68.1611 497.034 64.2602L485.645 66.7608Z" fill="currentColor" />
    <path d="M545.385 50.2571C545.685 45.7562 549.482 40.5549 556.375 40.5549C563.967 40.5549 567.165 45.3561 567.365 50.2571H545.385ZM568.664 63.0601C567.065 67.4609 563.668 70.5617 557.474 70.5617C550.88 70.5617 545.385 65.8606 545.087 59.3593H580.252C580.252 59.159 580.451 57.1587 580.451 55.2582C580.451 39.4547 571.361 29.7527 556.175 29.7527C543.588 29.7527 531.998 39.9548 531.998 55.6584C531.998 72.262 543.886 81.9642 557.374 81.9642C569.462 81.9642 577.255 74.8626 579.753 66.3607L568.664 63.0601Z" fill="currentColor" />
    {/* icon: lightning bolt */}
    <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#supa-logo-p0)" />
    <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#supa-logo-p1)" fillOpacity={0.2} />
    <path d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z" fill="#3ECF8E" />
    <defs>
      <linearGradient id="supa-logo-p0" x1="53.9738" y1="54.974" x2="94.1635" y2="71.8295" gradientUnits="userSpaceOnUse">
        <stop stopColor="#249361" />
        <stop offset="1" stopColor="#3ECF8E" />
      </linearGradient>
      <linearGradient id="supa-logo-p1" x1="36.1558" y1="30.578" x2="54.4844" y2="65.0806" gradientUnits="userSpaceOnUse">
        <stop />
        <stop offset="1" stopOpacity={0} />
      </linearGradient>
    </defs>
  </svg>
)

const triggerClasses =
  'group flex items-center border-transparent text-base md:text-sm leading-4 py-2 bg-transparent ' +
  'text-[var(--foreground-default)] hover:text-[var(--brand-link)] ' +
  'data-[state=open]:text-[var(--brand-link)] px-2 h-auto ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground-lighter)] ' +
  'focus-visible:rounded-md focus-visible:text-[var(--foreground-default)]'

const linkItemClasses =
  'group/menu-item flex items-center text-sm text-[var(--foreground-light)] hover:text-[var(--foreground-default)] ' +
  'select-none gap-3 rounded-md p-2 leading-none no-underline outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-[var(--foreground-lighter)] ' +
  'focus-visible:text-[var(--brand-link)]'

const Navbar: FC<NavbarProps> = ({
  logo,
  items = DEFAULT_ITEMS,
  githubStars,
  githubUrl = 'https://github.com/supabase/supabase',
  signInHref = 'https://supabase.com/dashboard',
  ctaLabel = 'Start your project',
  ctaHref = 'https://supabase.com/dashboard/sign-up',
  className = '',
}) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  const hasDropdown = (item: NavItem): boolean =>
    Boolean(item.children && item.children.length > 0)

  return (
    <nav
      className={`relative z-40 border-[var(--border-default)] border-b backdrop-blur-xs transition-all duration-300 ${className}`}
    >
      <div className="relative flex justify-between h-16 mx-auto lg:container lg:px-16 xl:px-20">
        {/* Left: Logo + Desktop Nav */}
        <div className="flex items-center px-6 lg:px-0 flex-1 sm:items-stretch justify-between">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <a href="/" aria-label="Go to homepage" className="block">
              {logo ?? <SupabaseLogo />}
            </a>

            {/* Desktop Navigation */}
            <NavigationMenu.Root className="relative hidden lg:flex">
              <NavigationMenu.List className="flex items-center">
                {items.map((item) => (
                  <NavigationMenu.Item key={item.label}>
                    {hasDropdown(item) ? (
                      <>
                        <NavigationMenu.Trigger className={triggerClasses}>
                          {item.label}
                          <ChevronDownIcon />
                        </NavigationMenu.Trigger>
                        {/* Content is teleported into the Viewport — no positioning here */}
                        <NavigationMenu.Content className="min-w-[260px]">
                          <ul className="p-2">
                            {item.children!.map((child) => (
                              <li key={child.href}>
                                <NavigationMenu.Link asChild>
                                  <a href={child.href} className={linkItemClasses}>
                                    {child.icon && (
                                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--border-strong)] bg-[var(--background-surface-200)] text-[var(--foreground-lighter)]">
                                        {child.icon}
                                      </span>
                                    )}
                                    <div className="flex flex-col justify-center">
                                      <p className="leading-snug text-[var(--foreground-default)] group-hover/menu-item:text-[var(--brand-link)]">
                                        {child.label}
                                      </p>
                                      {child.description && (
                                        <p className="mt-0.5 text-xs leading-snug text-[var(--foreground-lighter)]">
                                          {child.description}
                                        </p>
                                      )}
                                    </div>
                                  </a>
                                </NavigationMenu.Link>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenu.Content>
                      </>
                    ) : (
                      <NavigationMenu.Link asChild>
                        <a href={item.href ?? '#'} className={triggerClasses}>
                          {item.label}
                        </a>
                      </NavigationMenu.Link>
                    )}
                  </NavigationMenu.Item>
                ))}
              </NavigationMenu.List>

              {/* Viewport: positioned absolutely below the Root, receives the active Content */}
              <div className="absolute left-0 top-full z-50 pt-1.5">
                <NavigationMenu.Viewport className="overflow-hidden rounded-lg border border-[var(--border-default)] bg-[var(--background-surface-100)] shadow-lg" />
              </div>
            </NavigationMenu.Root>
          </div>

          {/* Right: GitHub + Sign in + CTA */}
          <div className="hidden lg:flex items-center gap-2">
            {githubStars && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="relative flex items-center gap-1 rounded-md border border-transparent text-xs px-2.5 py-1 h-[26px] text-[var(--foreground-light)] hover:text-[var(--foreground-default)] hover:bg-[var(--background-surface-300)] transition-colors duration-200"
              >
                <span className="flex items-center gap-1">
                  <GitHubIcon />
                  <StarIcon />
                  {githubStars}
                </span>
              </a>
            )}

            <a
              href={signInHref}
              className="relative flex items-center justify-center rounded-md border border-[var(--border-strong)] bg-[var(--background-muted)] text-[var(--foreground-default)] text-xs px-2.5 py-1 h-[26px] hover:bg-[var(--background-selection)] hover:border-[var(--border-stronger)] transition-colors duration-200"
            >
              Sign in
            </a>

            <a
              href={ctaHref}
              className="relative flex items-center justify-center rounded-md border border-[var(--brand-default)]/30 bg-[var(--brand-500)] text-[var(--foreground-default)] text-xs px-2.5 py-1 h-[26px] hover:bg-[var(--brand-500-hover)] hover:border-[var(--brand-default)] transition-colors duration-200"
            >
              {ctaLabel}
            </a>
          </div>
        </div>

        {/* Mobile hamburger */}
        <div className="inset-y-0 flex mr-2 items-center px-4 lg:hidden">
          <IconButton
            label={mobileOpen ? 'Close menu' : 'Open main menu'}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[var(--border-default)] bg-[var(--background-surface-75)]">
          <ul className="px-4 py-3 flex flex-col gap-1">
            {items.map((item) => (
              <li key={item.label}>
                {item.href ? (
                  <a
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-sm text-[var(--foreground-light)] hover:bg-[var(--background-surface-200)] hover:text-[var(--foreground-default)] transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="block rounded-md px-3 py-2 text-sm font-medium text-[var(--foreground-muted)]">
                    {item.label}
                  </span>
                )}
                {item.children && item.children.length > 0 && (
                  <ul className="ml-4 mt-1 flex flex-col gap-1">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <a
                          href={child.href}
                          className="block rounded-md px-3 py-2 text-sm text-[var(--foreground-light)] hover:bg-[var(--background-surface-200)] hover:text-[var(--foreground-default)] transition-colors"
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2 px-4 pb-4">
            <Button variant="default" size="small" href={signInHref}>
              Sign in
            </Button>
            <Button variant="primary" size="small" href={ctaHref}>
              {ctaLabel}
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
