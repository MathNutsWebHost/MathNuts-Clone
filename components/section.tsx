import type React from "react"
import { bebas } from "@/lib/fonts"
import { cn } from "@/lib/utils"

export function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2
      className={cn("text-3xl md:text-4xl tracking-wide text-center text-[#1b306a] mt-10", bebas.className, className)}
    >
      {children}
    </h2>
  )
}

export function Lead({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-center text-base md:text-lg text-slate-700 max-w-3xl mx-auto", className)}>{children}</p>
  )
}
