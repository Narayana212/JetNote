import { cn } from "@/lib/utils"

/**
 * Renders a skeleton component with a pulsating animation effect.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - The props to be spread on the div element.
 * @param {string} [className] - Additional CSS classes to be applied to the skeleton component.
 * @returns {JSX.Element} A div element with skeleton styling and animation.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/5", className)}
      {...props}
    />
  )
}

export { Skeleton }
