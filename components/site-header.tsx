import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="w-full">
      <div className="mx-auto max-w-5xl px-4">
        <div className="pt-8 pb-6">
          <h1 className="text-[40px] leading-none tracking-tight text-[#162B6F] font-bold font-[Oswald]">MathNuts</h1>
        </div>
        <div className="h-px w-[940px] max-w-full bg-[#162B6F]/85" />
        <nav aria-label="Site" className="w-full">
          <ul className="flex items-center justify-center gap-6 py-3 text-sm text-[#162B6F]">
            <li>
              <Link href="/" className="hover:text-[#142E84]">
                Home
              </Link>
            </li>
            <li>
              <Link href="/apply" className="hover:text-[#142E84]">
                Apply
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-[#142E84]">
                FAQ
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
