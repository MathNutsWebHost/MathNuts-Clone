import { oswald, inter } from "@/lib/fonts"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function FAQPage() {
  return (
    <div className={inter.className}>
      <SiteHeader />

      <main aria-labelledby="faq-heading">
        <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
          {/* Page title */}
          <h1 id="faq-heading" className={`${oswald.className} text-[40px] leading-[1.35] text-center text-[#162B6F]`}>
            FAQ
          </h1>

          {/* Intro blurb */}
          <p className="mt-4 text-center text-[15px] leading-[1.875] text-[#162B6F] max-w-3xl mx-auto">
            We look forward to seeing you at our next course. We’ve put together some helpful questions and answers
            below. If you need further information, please contact us and we’ll get back to you as soon as possible.
          </p>

          <div className="mt-10 space-y-8">
            <section aria-labelledby="q-unique">
              <h2 id="q-unique" className={`${oswald.className} text-[22px] leading-[1.41] text-[#162B6F]`}>
                Why is Mathnuts unique?
              </h2>
              <p className="mt-2 text-[15px] leading-[1.875] text-slate-800">
                Mathnuts classes are small (fewer than 10 students) and interactive, and they cover topics which are not
                usually taught in college or high school programs.
              </p>
            </section>

            <section aria-labelledby="q-trial">
              <h2 id="q-trial" className={`${oswald.className} text-[22px] leading-[1.41] text-[#162B6F]`}>
                Is it possible for us to participate in a trial class to determine if it aligns well with our
                preferences and needs?
              </h2>
              <p className="mt-2 text-[15px] leading-[1.875] text-slate-800">
                Yes. You can try a class to see if it is a good fit for your child.
              </p>
            </section>

            <section aria-labelledby="q-which-course">
              <h2 id="q-which-course" className={`${oswald.className} text-[22px] leading-[1.41] text-[#162B6F]`}>
                How do I know which course is right for me?
              </h2>
              <p className="mt-2 text-[15px] leading-[1.875] text-slate-800">
                Both courses are designed keeping in mind passionate young mathematicians. You can start with either
                course, depending on your child's interest and mathematical experience.
              </p>
            </section>

            <section aria-labelledby="q-level">
              <h2 id="q-level" className={`${oswald.className} text-[22px] leading-[1.41] text-[#162B6F]`}>
                What level of math courses do you recommend the students should have completed? What level of math are
                students expected to be at before joining the program?
              </h2>
              <div className="mt-2 space-y-4">
                <p className="text-[15px] leading-[1.875] text-slate-800">
                  Students should have completed Intermediate Algebra and be fluent with algebraic manipulations such as
                  polynomial multiplication and division, and graphing of the following: Linear equations, linear
                  inequalities, exponential and logarithmic functions, and the six trigonometric functions. Some
                  exposure to high school geometry is desirable, but not required.
                </p>
                <p className="text-[15px] leading-[1.875] text-slate-800">
                  Based on the student application Math Nuts will be able to determine if the student is a right fit for
                  its program. The main determinant is that a student loves math, has a quick mind, and wants to be
                  challenged. Not receiving admission should not be considered as lack of merit as there are spots for
                  only 3 – 4 math nuts at this time.
                </p>
              </div>
            </section>

            <section aria-labelledby="q-younger">
              <h2 id="q-younger" className={`${oswald.className} text-[22px] leading-[1.41] text-[#162B6F]`}>
                Is Math Nuts appropriate for students who are younger than 11 years old but are taking math courses in
                the high school curriculum or beyond?
              </h2>
              <p className="mt-2 text-[15px] leading-[1.875] text-slate-800">
                The year-long beta test found that 10 year‑old outliers were slightly holding back the flow of
                instruction in a group of mostly 11–13 year‑olds. Also, a narrow age range seems to work better with the
                interactive and often socratic method of instruction.
              </p>
            </section>

            <section aria-labelledby="q-when-held">
              <h2 id="q-when-held" className={`${oswald.className} text-[22px] leading-[1.41] text-[#162B6F]`}>
                When are the Math Nuts classes held?
              </h2>
              <p className="mt-2 text-[15px] leading-[1.875] text-slate-800">
                When sessions take place is determined based on the time‑availability for both students and
                professor(s). At this time, the sessions are on Tuesday evenings and Sunday early afternoons.
              </p>
            </section>

            <section aria-labelledby="q-session-expect">
              <h2 id="q-session-expect" className={`${oswald.className} text-[22px] leading-[1.41] text-[#162B6F]`}>
                What kind of session should I expect at Math Nuts?
              </h2>
              <div className="mt-2 space-y-4">
                <p className="text-[15px] leading-[1.875] text-slate-800">
                  It is mostly detailed discussion of a topic. The stress is on concept and proof and fun.
                </p>
                <p className="text-[15px] leading-[1.875] text-slate-800">
                  Topics are generally of the type that are fundamental but for which there is no time in the university
                  due to the already‑crowded core courses. These are also the type generally not available online and
                  they are best taught directly by published mathematicians fluent in the area. Examples of topics are
                  geometries including non‑Euclidean geometries, geometric transformations, axiomatic set theory
                  including Dedekind cuts, construction of real numbers and statements equivalent to AC (axiom of
                  choice), an introduction to complex analysis such as an in‑depth study that includes and extends the
                  first three chapters of Ahlfors, and so on.
                </p>
              </div>
            </section>

            <section aria-labelledby="q-aid">
              <h2 id="q-aid" className={`${oswald.className} text-[22px] leading-[1.41] text-[#162B6F]`}>
                When can we receive financial aid?
              </h2>
              <div className="mt-2 space-y-4">
                <p className="text-[15px] leading-[1.875] text-slate-800">
                  Math Nuts is for mentoring the early adolescent who is nuts about math. As these nuts are likely to
                  benefit the world more than non‑nuts, it makes sense that they receive timely mentoring and peers
                  regardless of family financial background. Do not inform that financial aid is needed until after
                  receiving a report that the student is suitable for the program, for financial aid does not have any
                  effect on the admissions process. Financial aid is based solely on reported income from the previous
                  calendar year. Based on a sigmoid function, gross family income less than $150,000 will qualify and
                  family income below $50,000 pays no fee.
                </p>
              </div>
            </section>

            <section aria-labelledby="q-new-groups">
              <h2 id="q-new-groups" className={`${oswald.className} text-[22px] leading-[1.41] text-[#162B6F]`}>
                When are the Math Nuts classes held? (new groups)
              </h2>
              <p className="mt-2 text-[15px] leading-[1.875] text-slate-800">
                After a group starts, say on Feb 1, and there are enough late applicants who qualify, then a new group
                may start with them at a correspondingly later date. The website will have fresh info.
              </p>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
