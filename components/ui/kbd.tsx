import * as React from "react"
import { cn } from "@/lib/utils"

interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

function Kbd({ className, children, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded border border-border/60 bg-muted/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  )
}

interface KbdGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

function KbdGroup({ className, children, ...props }: KbdGroupProps) {
  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Kbd, KbdGroup }
