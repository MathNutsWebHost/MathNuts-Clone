import Image from "next/image"
import { SectionTitle, Lead } from "@/components/section"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { bebas, inter } from "@/lib/fonts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  return (
    <div className={`${inter.className}`}>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4">
        <section className="py-12 md:py-20">
          <h1 className={`${bebas.className} text-[#1b306a] text-5xl md:text-7xl leading-[1.05] text-center`}>
            Nurturing Future
            <br />
            Mathematicians
          </h1>
          <Lead className="mt-6">
            Does your child yearn for mathematical insights? Do they want to go deeper into math? Do you wish there was
            a mentor to take them on a journey of discovery to help build deep, intuitive understanding?
          </Lead>
        </section>

        <SectionTitle>MISSION</SectionTitle>
        <Lead className="mt-4">
          Invest in the next generation of mathematicians by connecting exceptionally talented children with mentors
          through weekly classes and guided practice.
        </Lead>

        <SectionTitle className="mt-12">CLASSES</SectionTitle>

        <div className="mt-6 rounded-xl overflow-hidden border bg-muted/20">
          {/* Using fill requires the parent to be position: relative [^1][^2] */}
          <div className="relative w-full aspect-[16/7]">
            <Image
              src="/images/mathnuts-home.jpg"
              alt="Math chalkboard with equations"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className={`${bebas.className} tracking-wide text-[#1b306a]`}>Math Circles</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700">
              Collaborative problem solving focused on patterns, logic, and discovery. Ideal for building mathematical
              intuition.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className={`${bebas.className} tracking-wide text-[#1b306a]`}>Proofs & Reasoning</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700">
              Transition from computation to formal thinking. Learn to write and critique clear, rigorous arguments.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className={`${bebas.className} tracking-wide text-[#1b306a]`}>Contest Track</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700">
              Enrichment and training for contests like AMC and AIME with emphasis on strategy and creative problem
              solving.
            </CardContent>
          </Card>
        </div>

        <SectionTitle className="mt-16">ABOUT</SectionTitle>
        <Lead className="mt-4 mb-20">
          We’re educators and mathematicians passionate about nurturing curiosity and deep understanding through
          thoughtful, student‑centered instruction.
        </Lead>
      </main>
      <SiteFooter />
    </div>
  )
}
