import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-border hover:bg-accent/50",
        neural: "border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/20 hover:scale-[1.02] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-primary/5 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
        glass: "border-border/30 bg-card/30 backdrop-blur-md hover:bg-card/50 hover:border-border/50 hover:shadow-lg hover:shadow-primary/10",
        interactive: "border-border hover:bg-accent hover:shadow-xl hover:shadow-primary/10 cursor-pointer touch-manipulation hover:scale-[1.02] hover:border-primary/30 group",
        project: "border-primary/20 bg-gradient-to-br from-card via-card/95 to-primary/5 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/25 hover:scale-[1.03] cursor-pointer group relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-primary/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000 after:absolute after:inset-0 after:bg-gradient-to-br after:from-transparent after:via-transparent after:to-primary/5 after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500",
        blog: "border-border/50 bg-gradient-to-br from-card to-muted/20 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/15 hover:scale-[1.01] cursor-pointer group relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-primary/50 before:to-primary/20 before:transform before:scale-x-0 hover:before:scale-x-100 before:transition-transform before:duration-500 before:origin-left",
      },
      padding: {
        none: "",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, className }))}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants }