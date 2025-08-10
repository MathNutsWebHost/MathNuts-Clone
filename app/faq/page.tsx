import { bebas, inter } from "@/lib/fonts"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  return (
    <div className={inter.className}>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <h1 className={`${bebas.className} text-5xl text-[#1b306a] tracking-wide text-center`}>FAQ</h1>
        <div className="mt-8">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="what">
              <AccordionTrigger>What is the focus of the program?</AccordionTrigger>
              <AccordionContent>
                We emphasize deep understanding through problem solving, discussion, and guided exploration rather than
                memorization.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="who">
              <AccordionTrigger>Who is it for?</AccordionTrigger>
              <AccordionContent>
                Curious, motivated students who want to go beyond the standard curriculum and enjoy mathematical
                challenges.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="schedule">
              <AccordionTrigger>How are classes scheduled?</AccordionTrigger>
              <AccordionContent>
                Weekly sessions with small groups. Exact times depend on cohort availability; details are shared after
                you apply.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="tuition">
              <AccordionTrigger>Is there tuition or financial aid?</AccordionTrigger>
              <AccordionContent>Tuition varies by course. Need‑based scholarships may be available.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
