import type React from "react"
import { oswald } from "@/lib/fonts"
import { cn } from "@/lib/utils"

export function SectionTitle({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <h2
      className={cn(
        "mt-10 text-[40px] leading-[1.35] text-center text-[#162B6F] font-bold",
        oswald.className,
        className,
      )}
    >
      {children}
    </h2>
  )
}

export function Lead({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <p className={cn("text-[15px] leading-[1.875] text-slate-800", className)}>{children}</p>
}
