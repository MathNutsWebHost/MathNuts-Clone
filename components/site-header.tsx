"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { bebas } from "@/lib/fonts"

const nav = [
  { href: "/", label: "Home" },
  { href: "/apply", label: "Apply" },
  { href: "/faq", label: "FAQ" },
]

export function SiteHeader() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-5xl px-4 h-16 flex items-center gap-6">
        <Link href="/" className={cn("text-2xl tracking-wide text-[#142a5e]", bebas.className)}>
          MathNuts
        </Link>
        <nav className="ml-auto">
          <ul className="flex items-center gap-6 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "transition-colors text-[#1b306a]/80 hover:text-[#1b306a]",
                    pathname === item.href && "text-[#1b306a] font-medium",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
