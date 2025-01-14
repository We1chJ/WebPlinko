import * as React from "react"

import { cn } from "@/lib/utils"

// Noted: css is edited
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border-2 bg-[#0F212E] border-[rgb(47,69,83)] px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus:border-[rgb(80,110,130)] hover:border-[rgb(80,110,130)] focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-colors duration-200",
          className
        )}
        ref={ref}
        autoComplete="off"
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
