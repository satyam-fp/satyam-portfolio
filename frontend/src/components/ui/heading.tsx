import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const headingVariants = cva(
  "font-bold tracking-tight",
  {
    variants: {
      level: {
        1: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
        2: "text-2xl sm:text-3xl md:text-4xl",
        3: "text-xl sm:text-2xl md:text-3xl",
        4: "text-lg sm:text-xl md:text-2xl",
        5: "text-base sm:text-lg md:text-xl",
        6: "text-sm sm:text-base md:text-lg",
      },
      variant: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        primary: "text-primary",
        gradient: "bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent",
        neural: "bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
    },
    defaultVariants: {
      level: 1,
      variant: "default",
      align: "left",
    },
  }
)

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level, variant, align, as, ...props }, ref) => {
    const Component = (as || `h${level || 1}`) as React.ElementType
    
    return React.createElement(Component, {
      ref,
      className: cn(headingVariants({ level, variant, align, className })),
      ...props
    })
  }
)
Heading.displayName = "Heading"

export { Heading, headingVariants }