import type { FC, ReactNode } from 'react'
import Button from '../../atoms/Button'

export interface HeroSectionProps {
  title: ReactNode
  description: ReactNode
  primaryCTA?: {
    label: string
    href: string
  }
  secondaryCTA?: {
    label: string
    href: string
  }
  className?: string
}

// mhtml structure:
// <div class="justify-center text-center">
//   <div class="pt-[90px] flex flex-col items-center justify-center gap-4 lg:gap-8">
//     <div class="flex flex-col items-center">
//       <h1 class="text-foreground text-4xl sm:text-5xl sm:leading-none lg:text-7xl">
//         <span class="block text-foreground">Build in a weekend</span>
//         <span class="text-brand block md:ml-0">Scale to millions</span>
//       </h1>
//       <p class="pt-2 text-foreground my-3 text-sm sm:mt-5 lg:mb-0 sm:text-base lg:text-lg">...</p>
//     </div>
//     <div class="flex items-center gap-2">
//       <a data-size="medium" ...>Start your project</a>
//       <a data-size="medium" ...>Request a demo</a>
//     </div>
//   </div>
// </div>
const HeroSection: FC<HeroSectionProps> = ({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  className = '',
}) => {
  return (
    <div className={`justify-center text-center ${className}`}>
      <div className="pt-[90px] flex flex-col items-center justify-center gap-4 lg:gap-8">
        <div className="flex flex-col items-center">
          <h1 className="text-[var(--foreground-default)] text-4xl sm:text-5xl sm:leading-none lg:text-7xl">
            {title}
          </h1>
          <p className="pt-2 text-[var(--foreground-default)] my-3 text-sm sm:mt-5 lg:mb-0 sm:text-base lg:text-lg max-w-2xl">
            {description}
          </p>
        </div>

        {(primaryCTA || secondaryCTA) && (
          <div className="flex items-center gap-2">
            {primaryCTA && (
              <Button variant="primary" size="medium" href={primaryCTA.href}>
                {primaryCTA.label}
              </Button>
            )}
            {secondaryCTA && (
              <Button variant="default" size="medium" href={secondaryCTA.href}>
                {secondaryCTA.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default HeroSection
