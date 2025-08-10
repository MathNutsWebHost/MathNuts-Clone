import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-5xl px-4 py-10 text-sm text-muted-foreground grid gap-2 sm:flex sm:items-center sm:justify-between">
        <div>© {new Date().getFullYear()} MathNuts (demo clone)</div>
        <div className="flex gap-4">
          <Link href="/faq" className="hover:text-foreground">
            FAQ
          </Link>
          <a href="mailto:hello@example.com" className="hover:text-foreground">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
