"use client"

import type React from "react"

import Image from "next/image"
import { useState } from "react"
import { inter, oswald } from "@/lib/fonts"
import { Lead, SectionTitle } from "@/components/section"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSuccess(null)
    setError(null)
    setIsSubmitting(true)

    try {
      const formEl = e.currentTarget
      const fd = new FormData(formEl)

      const res = await fetch("/api/contact/submit", {
        method: "POST",
        body: fd,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || "Failed to send message")
      }

      setSuccess("Thank you for your message! We'll get back to you soon.")
      formEl.reset()
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`${inter.className}`}>
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4">
        {/* Hero */}
        <section className="py-12 md:py-20">
          <h1 className={`${oswald.className} text-[#162B6F] text-5xl md:text-7xl leading-[1.05] text-center`}>
            Nurturing Future
            <br />
            Mathematicians
          </h1>

          <div className="mt-6 grid gap-2 text-[18px] font-semibold text-slate-800">
            <p>Does your child yearn for mathematical insights? Do they want to go deeper into math? Do you</p>
            <p>wish there was a mentor to take them on a journey of discovery of higher math and to help them</p>
            <p>build a deep intuitive understanding?</p>
          </div>
        </section>

        {/* Mission */}
        <SectionTitle>MISSION</SectionTitle>
        <Lead className="mt-4">
          Invest in the next generation of mathematicians by connecting exceptionally mathematically talented children
          with mathematicians and mentoring them through weekly classes and homework.
        </Lead>

        {/* Classes */}
        <SectionTitle className="mt-12">CLASSES</SectionTitle>

        <div className="mt-6 rounded-xl overflow-hidden border bg-muted/20">
          {/* Using next/image fill requires a relatively positioned parent. */}
          <div className="relative w-full aspect-[16/6]">
            <Image
              src="/images/chalkboard.avif"
              alt="Chalkboard filled with math equations"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <Lead className="mt-6">
          The classes are on topics of fundamental importance to mathematicians which are neither covered in school,
          competition training, nor generally available in core courses at university. Typically, small groups of 6
          students convene virtually once a week during the non-summer months, where they participate in 75-minute
          interactive lessons centered around specific topics. We avoid scheduling classes during the demanding pre-exam
          weeks throughout the school year, ensuring students can fully focus on their academic commitments during those
          times. Class timings and dates are determined based on the availability of all participants collectively.
        </Lead>

        {/* Students */}
        <SectionTitle>STUDENTS</SectionTitle>
        <Lead className="mt-4">
          Students should be 10 -13 years old, which we believe is a critical age for the development of deep thinking
          habits in mathematics. The Math Nuts program will continue to extend into the high school years as enrolled
          students progress. Topics are selected considering the mathematical maturity of the students.
        </Lead>

        {/* Homework */}
        <SectionTitle>HOMEWORK</SectionTitle>
        <Lead className="mt-4">
          To reinforce the lecture discussions, students are assigned weekly homework that takes approximately 1- 2
          hours of their time. These assignments aim to enhance their ability to write proofs and verify understanding
          and appreciation of the subject matter.
        </Lead>

        {/* Tuition */}
        <SectionTitle>TUITION</SectionTitle>
        <Lead className="mt-4">
          The tuition for the program is $125 per class, and we offer financial assistance tailored to individual needs.
          We strongly encourage girls to apply, as we strive to foster inclusivity and diversity within our program.
        </Lead>

        {/* Philosophy */}
        <SectionTitle>PHILOSOPHY</SectionTitle>
        <div className="mt-4 space-y-4">
          <Lead>
            At this age, we look for students&apos; increasing confidence in math as the primary sign of future success.
            This can be measured by weekly homework, improved proofwriting ability, and class participation.
          </Lead>
          <Lead>
            We believe in investing in students&apos; long-term education rather than short-term goals. Therefore,
            MathNuts emphasizes the depth and breadth of mathematical knowledge and preparation for eventual research.
            Research in mathematics is not like the sciences: It is unrealistic to expect students to produce original
            research papers while still learning concepts. However, studying new ideas under a mentor&apos;s supervision
            leads the student to ask questions, pose conjectures, and then study more as new avenues of exploration are
            opened. As mathematicians, we deeply understand that the iterative journey of learning and questioning forms
            the very essence of research in mathematics. Our role is to guide the students as they navigate this
            enriching process.
          </Lead>
          <Lead>Note that mathematics progresses from answers to questions!</Lead>
        </div>

        {/* Application Process */}
        <SectionTitle>APPLICATION PROCESS</SectionTitle>
        <div className="mt-4 space-y-4">
          <Lead>
            If you are enthusiastic about joining our program, we kindly request you to complete the application form.
            All applicants must complete an algebra readiness test appropriate to the two age groups. This test is sent
            to applicants who pass the first screening of the submitted application. The application deadline for the
            next batch is December 15th, 2025 and the class start date is January first week.
          </Lead>
          <Lead>
            Our admission process happens biannually, with applications accepted for the Fall cycle (April 15th to June
            2nd) and the Spring cycle (October 15th to December 15th). 
            Fall classes commence in September, while spring classes begin in the first week of January. We look forward to receiving your
            applications during these periods.&nbsp; For additional details or inquiries, please contact us at{" "}
            <a href="mailto:mathnuts@googlegroups.com" className="underline hover:no-underline">
              mathnuts@googlegroups.com
            </a>
            .
          </Lead>
          <Lead>
            <span className="font-bold">Applications open now for Spring 2026 session (January 4th to May 17th 2026).
            </span>
          </Lead>
          <Lead>
            <span className="font-bold">
            Application deadline: December 15th 2025.
            </span>
          </Lead>
          <Lead>
            <span className="font-bold">
            <a href="https://www.mathnuts.org/apply" className="underline">
            Apply Now
            </a>
            </span>
          </Lead>
        </div>

        {/* Our History */}
        <SectionTitle>OUR HISTORY</SectionTitle>
        <Lead className="mt-4">
          MathNuts was founded in 2021 by Dr. George Thomas, founder of Mathcamp, MathPath, and Epsilon Camp.
        </Lead>

        {/* Upcoming Courses */}
        <SectionTitle>UPCOMING COURSES</SectionTitle>
        <div className="mt-4 space-y-6">
          <Lead>
            There are two strands, one for students aged 10/11, and one for age 12/13. Students worldwide are eligible
            to apply. With fewer than 10 students per class, the program ensures personalized attention, fostering a
            learning environment conducive to young minds.&nbsp;
          </Lead>
          <div className="space-y-2">
            <p className="font-semibold flex justify-between">
              <span>I. Set Theory and Beyond</span>
              <span>Fall (September - December)</span>
            </p>
            <Lead>

              This course, Axiomatic Set Theory, explores the foundational principles of set theory using an axiomatic approach, focusing on the concepts of well-ordered sets and the hierarchy of infinities. Students will learn the wonderful constructions of the natural numbers, rationals and real numbers out of the empty set and the axioms, understand the properties of infinite sets, and delve into the fascinating realm of transfinite numbers. 
            </Lead>
          </div>
          <div className="space-y-2">
            <p className="font-semibold flex justify-between">
              <span>II. Geometric Transformations</span>
              <span>Spring (January - May)</span>
            </p>
            <Lead>
              For over two thousand years Euclidean geometry remained the synthetic geometry of Euclid's Elements;
              lengths and angles were not measured but compared. Then, Rene Descartes (1596–1650) introduced the method
              of doing geometry using algebra and numbers – analytic geometry. Later, Felix Klein (1849–1925) introduced
              a more general method (transformations), still involving algebra, that was applicable to other geometries
              as well. The fundamental geometrical notion of congruence has to do with moving (transforming) a figure to
              coincide with another. The course studies geometric transformations that preserve distance in the
              Euclidean plane. These transformations will be seen to describe ALL the symmetry patterns in the plane
              (and 3‑D which we don't cover). The course begins with an introduction to Analytic geometry which is also
              useful for Calculus.
            </Lead>
          </div>
          <div className="space-y-2">
            <p className="font-semibold flex justify-between">
              <span>III. Affine and Projective geometries</span>
              <span>Fall (September - December)</span>
            </p>
            <Lead>
              The goal of this course is to develop a clear grasp of the various geometries and their relationships to
              one another. For this reason, we study projective geometry for it entails a unified view and closely
              relates the different geometries, including Euclidean geometry and non‑Euclidean geometries, as special
              cases. And the geometry most closely related to projective geometry is affine geometry; studying affine
              geometry enables greater understanding of projective geometry; so we introduce the former first. A way to
              see the various geometries, without needing prerequisites in advanced algebra, is the axiomatic approach
              which we use in the course.
            </Lead>
          </div>
          <div className="space-y-2">
            <p className="font-semibold flex justify-between">
              <span>IV. Non‑Euclidean geometry</span>
              <span>Spring (January - May)</span>
            </p>
            <Lead>
              Although Non‑Euclidean geometry means geometries other than Euclidean geometry, the reference in
              mathematics is to two particular geometries – Elliptic geometry and Hyperbolic geometry. The impression of
              school students and the public in general is that geometry consists of Euclidean geometry, whereas
              Euclidean geometry is only one of many geometries. However, there are two geometries which are related to
              Euclidean geometry and whose study gives a greater understanding of what Euclidean geometry is really
              about. There are three geometries called constant curvature geometries where a 'plane' of the geometry has
              a curvature that does not change. In Euclidean geometry, the plane is flat in the sense that its curvature
              is zero. In contrast, a hyperbolic plane has negative curvature like that of a horse saddle and an
              elliptic plane has positive curvature like a sphere. While the emphasis in this course is these two
              geometries, we begin with those concepts of Euclidean geometry in which it differs — from the other two
              constant‑curvature geometries — and the study leads us to Elliptic and Hyperbolic geometry. This course is
              ideal for building in the student an appreciation of the idea of proof in mathematics and to improve the
              student's ability to construct proofs.
            </Lead>
          </div>
        </div>

        {/* Founder */}
        <SectionTitle className="mt-16">Founder</SectionTitle>
        <div className="mt-6 grid gap-4 sm:grid-cols-[200px_1fr] items-start">
          {/* Use a remote <img> tag to avoid remote image config */}
          <div className="w-[200px] h-[199px] rounded-full overflow-hidden border shadow">
            <img
              src="/images/design-mode/George%20Thomas.jpg"
              alt="George R. Thomas portrait"
              width={200}
              height={199}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-[18px] text-center sm:text-left leading-[1.75] text-[#162B6F]">
              Dr.&nbsp; Thomas is an independent mathematician with long experience teaching and mentoring in summer
              programs for students showing high promise in mathematics. He has founded summer programs for students showing high promise in mathematics.
            </p>
            <p className={`${oswald.className} text-[#162B6F] text-[18px] text-center sm:text-left mt-2`}>
              George R. Thomas
            </p>
          </div>
        </div>

        {/* Get in Touch Section */}
        <section className="mt-20 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px] shadow-lg">
            {/* Left side - Contact Info */}
            <div className="bg-[#3c4a8c] text-white p-8 lg:p-12 flex flex-col justify-center">
              <h2 className="text-4xl lg:text-5xl font-bold mb-8" style={{ fontFamily: "Arial, sans-serif" }}>
                Get in Touch
              </h2>
              <p className="text-base leading-relaxed mb-12 max-w-sm">
                Thank you for your interest in Math Nuts. For general inquiries, please contact us using the Get in
                Touch form. We look forward to hearing from you!
              </p>
              <div className="space-y-3">
                <p className="text-base">(650) 492-8041</p>
                <p className="text-base">mathnuts@googlegroups.com</p>
              </div>
            </div>

            {/* Right side - Contact Form */}
            <div className="bg-[#f5f5f5] p-8 lg:p-12 flex flex-col justify-center">
              <form className="space-y-6" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-[#6b7bc4] mb-2 font-medium">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      className="w-full px-3 py-3 border border-gray-400 bg-white focus:outline-none focus:border-[#3c4a8c] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#6b7bc4] mb-2 font-medium">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      className="w-full px-3 py-3 border border-gray-400 bg-white focus:outline-none focus:border-[#3c4a8c] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#6b7bc4] mb-2 font-medium">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-3 py-3 border border-gray-400 bg-white focus:outline-none focus:border-[#3c4a8c] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#6b7bc4] mb-2 font-medium">Message</label>
                  <textarea
                    name="message"
                    rows={6}
                    className="w-full px-3 py-3 border border-gray-400 bg-white focus:outline-none focus:border-[#3c4a8c] resize-none transition-colors"
                  />
                </div>

                {/* Status messages */}
                <div className="min-h-[24px]" aria-live="polite">
                  {success && <p className="text-green-600 text-sm">{success}</p>}
                  {error && <p className="text-red-600 text-sm">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#6b7bc4] hover:bg-[#5a6bb3] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors text-base"
                >
                  {isSubmitting ? "Sending..." : "Submit"}
                </button>
              </form>
            </div>
          </div>
        </section>

        <div className="mb-20" />
      </main>

      <SiteFooter />

      {/* Elfsight AI Chatbot */}
      <div className="elfsight-app-09c7ac3f-a982-4a1c-b7ef-f4c31124cb99" data-elfsight-app-lazy></div>
    </div>
  )
}
