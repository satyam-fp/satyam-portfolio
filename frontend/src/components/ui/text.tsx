import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const textVariants = cva(
  "",
  {
    variants: {
      size: {
        xs: "text-xs",
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
        responsive: "text-sm sm:text-base md:text-lg",
      },
      variant: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        primary: "text-primary",
        secondary: "text-secondary-foreground",
        accent: "text-accent-foreground",
        destructive: "text-destructive",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
      font: {
        sans: "font-sans",
        mono: "font-mono",
      },
      leading: {
        none: "leading-none",
        tight: "leading-tight",
        normal: "leading-normal",
        relaxed: "leading-relaxed",
        loose: "leading-loose",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
        justify: "text-justify",
      },
    },
    defaultVariants: {
      size: "base",
      variant: "default",
      weight: "normal",
      font: "sans",
      leading: "normal",
      align: "left",
    },
  }
)

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: "p" | "span" | "div" | "label"
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, size, variant, weight, font, leading, align, as = "p", ...props }, ref) => {
    return React.createElement(as, {
      ref,
      className: cn(textVariants({ size, variant, weight, font, leading, align, className })),
      ...props
    })
  }
)
Text.displayName = "Text"

export { Text, textVariants }