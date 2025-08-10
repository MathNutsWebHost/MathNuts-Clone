"use client"

import type React from "react"

import { useRef, useState } from "react"
import { oswald, inter } from "@/lib/fonts"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const BRAND_HEADING = "#162b6f" // MathNuts heading/nav color
const BRAND_LABEL = "#4a5aa6" // small bluish labels
const UNDERLINE = "#c7cfe8" // light underline border
const BRAND_BTN = "#5570b4" // submit/button fill
const BRAND_BTN_HOVER = "#4b66ab"

function InputUnderline(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props
  return (
    <input
      {...rest}
      className={[
        "w-full bg-[#f8f9fc] px-3 py-2",
        "rounded-none",
        "border-0 border-b",
        "border-[var(--underline)]",
        "focus:outline-none focus:ring-0 focus:border-[var(--heading)]",
        "placeholder:text-slate-400",
        className || "",
      ].join(" ")}
      style={
        {
          "--underline": UNDERLINE,
          "--heading": BRAND_HEADING,
        } as React.CSSProperties
      }
    />
  )
}

function TextareaUnderline(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className, ...rest } = props
  return (
    <textarea
      {...rest}
      className={[
        "w-full bg-[#f8f9fc] px-3 py-2 min-h-[130px]",
        "rounded-none resize-y",
        "border-0 border-b",
        "border-[var(--underline)]",
        "focus:outline-none focus:ring-0 focus:border-[var(--heading)]",
        "placeholder:text-slate-400",
        className || "",
      ].join(" ")}
      style={
        {
          "--underline": UNDERLINE,
          "--heading": BRAND_HEADING,
        } as React.CSSProperties
      }
    />
  )
}

export default function AssessmentPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState("assessment_firstname_lastname.pdf")

  const onChooseFile = () => fileInputRef.current?.click()
  const onFileChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.name.toLowerCase().endsWith(".pdf")) {
      alert("Please upload a single PDF file.")
      e.target.value = ""
      return
    }
    setFileName(f.name)
  }

  return (
    <div className={inter.className}>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 md:px-6 py-12 md:py-16">
        {/* Heading */}
        <h1
          className={`${oswald.className} font-bold leading-tight text-4xl md:text-[40px]`}
          style={{ color: BRAND_HEADING }}
        >
          Assessment
        </h1>

        {/* Instruction bullets */}
        <ul className="mt-6 list-disc pl-5 space-y-2 text-slate-700 max-w-4xl">
          <li>The assessment file sent to you includes detailed instructions on how to complete and submit work.</li>
          <li>
            It is best to take a few days to a week to complete the Readiness Assessment. Take time to think hard and
            show steps on how you arrived at the solution.
          </li>
          <li>
            Scan completed pages into a single PDF file. Ensure that the scan is clear and legible. Name the file as
            assessment_firstname_lastname.pdf. Then upload it below along with the short form including your name and
            email address.
          </li>
        </ul>

        {/* Form */}
        <form
          className="mt-12"
          onSubmit={(e) => {
            e.preventDefault()
            alert("Submitted (demo)")
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left column */}
            <div>
              <label className="block text-[13px] mb-2" style={{ color: BRAND_LABEL }}>
                First Name
              </label>
              <InputUnderline name="firstName" autoComplete="given-name" required />
            </div>

            {/* Right column (message) */}
            <div className="md:row-span-2">
              <label className="block text-[13px] mb-2" style={{ color: BRAND_LABEL }}>
                Message
              </label>
              <TextareaUnderline name="message" placeholder="Type a short message (optional)" />
            </div>

            <div>
              <label className="block text-[13px] mb-2" style={{ color: BRAND_LABEL }}>
                Last Name
              </label>
              <InputUnderline name="lastName" autoComplete="family-name" />
            </div>

            <div>
              <label className="block text-[13px] mb-2" style={{ color: BRAND_LABEL }}>
                Email <span aria-hidden="true">*</span>
              </label>
              <InputUnderline name="email" type="email" autoComplete="email" required />
            </div>

            {/* Upload control */}
            <div className="md:col-span-1">
              <label className="block text-[13px] mb-2" style={{ color: BRAND_LABEL }}>
                Upload File
              </label>
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  className="sr-only"
                  onChange={onFileChanged}
                />
                <button
                  type="button"
                  onClick={onChooseFile}
                  className="inline-flex items-center gap-2 rounded-md border px-4 py-2 transition"
                  style={{
                    color: BRAND_BTN,
                    borderColor: BRAND_BTN,
                  }}
                >
                  <span>Upload File</span>
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-[13px] text-slate-500">{fileName}</p>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-12 flex justify-center">
            <Button
              type="submit"
              className="w-full sm:w-[300px] md:w-[360px] py-5 text-white"
              style={{ backgroundColor: BRAND_BTN }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND_BTN_HOVER)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND_BTN)}
            >
              Submit
            </Button>
          </div>
        </form>
      </main>
      <SiteFooter />
    </div>
  )
}
