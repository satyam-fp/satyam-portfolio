import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const sectionVariants = cva(
  "w-full",
  {
    variants: {
      spacing: {
        none: "",
        sm: "py-8",
        default: "py-8 sm:py-12 md:py-16",
        lg: "py-12 sm:py-16 md:py-20",
        xl: "py-16 sm:py-20 md:py-24",
      },
      background: {
        default: "bg-background",
        muted: "bg-muted/30",
        card: "bg-card",
        gradient: "bg-gradient-to-br from-background via-background to-primary/5",
        neural: "bg-gradient-to-br from-background to-primary/5 relative overflow-hidden",
      },
    },
    defaultVariants: {
      spacing: "default",
      background: "default",
    },
  }
)

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing, background, ...props }, ref) => (
    <section
      ref={ref}
      className={cn(sectionVariants({ spacing, background, className }))}
      {...props}
    />
  )
)
Section.displayName = "Section"

export { Section, sectionVariants }