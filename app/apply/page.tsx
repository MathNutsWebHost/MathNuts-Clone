"use client"

import { oswald, inter } from "@/lib/fonts"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"

export default function ApplyPage() {
  return (
    <div className={inter.className}>
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 py-16 md:py-20">
        <h1 className={`${oswald.className} text-center text-[#1b306a] text-5xl md:text-6xl font-bold tracking-wide`}>
          How to Apply
        </h1>

        <div className="mt-10 space-y-5 text-slate-700 leading-8">
          <p className="text-left">
            If you are enthusiastic about joining our program, please complete the application form. The application
            deadline for the next batch is December 15th, 2025, and the class start date is January 4th, 2026. If you
            require further details or have any inquiries, please feel free to contact us at{" "}
            <a
              href="mailto:mathnuts@googlegroups.com"
              className="underline underline-offset-2 hover:no-underline text-[#1b306a]"
            >
              mathnuts@googlegroups.com
            </a>
            .
          </p>
          <p className="text-left">
            Selected applicants will be sent a Readiness Assessment, which will help us evaluate your child’s
            mathematical abilities and identify the most suitable cohort for them.
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-16">
          <Button asChild className="bg-[#4f5db1] text-white hover:bg-[#3f4fa3] shadow-sm px-5">
            <a href="/apply/application-form">Application Form</a>
          </Button>

          <Button asChild className="bg-[#4f5db1] text-white hover:bg-[#3f4fa3] shadow-sm px-5">
            <a href="/apply/assessment">Assessment</a>
          </Button>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
