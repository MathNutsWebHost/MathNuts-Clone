"use client"

import type React from "react"
import { useRef, useState } from "react"
import { oswald, inter } from "@/lib/fonts"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { ChevronDown, Plus } from "lucide-react"

const BRAND_HEADING = "#1b306a"
const BRAND_LABEL = "#4a5aa6"
const UNDERLINE = "#c7cfe8"
const BRAND_BTN = "#4f5db1"
const BRAND_BTN_HOVER = "#3f4fa3"

function InputUnderline(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "w-full bg-[#f7f8fc] px-3 py-2",
        "border-0 border-b border-[var(--underline)]",
        "focus:outline-none focus:ring-0 focus:border-[var(--heading)]",
        "placeholder:text-slate-400 rounded-none",
        props.className || "",
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

function SelectUnderline({
  options,
  placeholder = "Select",
  value,
  onChange,
}: {
  options: string[]
  placeholder?: string
  value?: string
  onChange?: (val: string) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full bg-[#f7f8fc] px-3 py-2 text-left border-0 border-b border-[var(--underline)] rounded-none focus:outline-none focus:ring-0 focus:border-[var(--heading)]"
        style={
          {
            "--underline": UNDERLINE,
            "--heading": BRAND_HEADING,
          } as React.CSSProperties
        }
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={value ? "text-slate-700" : "text-slate-400"}>{value || placeholder}</span>
        <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-slate-500" />
      </button>
      {open && (
        <ul
          className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md border border-[var(--underline)] bg-white shadow-sm"
          role="listbox"
          style={{ ["--underline" as any]: UNDERLINE }}
        >
          {options.map((opt) => (
            <li
              key={opt}
              role="option"
              onClick={() => {
                onChange?.(opt)
                setOpen(false)
              }}
              className="cursor-pointer px-3 py-2 hover:bg-[#eef1fb] text-slate-700"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function TextareaUnderline(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[
        "w-full bg-[#f7f8fc] px-3 py-2 min-h-[140px]",
        "border-0 border-b border-[var(--underline)]",
        "focus:outline-none focus:ring-0 focus:border-[var(--heading)]",
        "placeholder:text-slate-400 rounded-none resize-y",
        props.className || "",
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

export default function ApplicationFormPage() {
  const [schooling, setSchooling] = useState<string>("")
  const [reading, setReading] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Optional PDF attachment
  const fileRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string>("No file chosen")
  const [fileObj, setFileObj] = useState<File | null>(null)

  function onPickFile() {
    fileRef.current?.click()
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.name.toLowerCase().endsWith(".pdf")) {
      alert("Please upload a single PDF file.")
      e.target.value = ""
      setFileName("No file chosen")
      setFileObj(null)
      return
    }
    setFileName(f.name)
    setFileObj(f)
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSuccess(null)
    setError(null)
    setIsSubmitting(true)

    try {
      const formEl = e.currentTarget
      const fd = new FormData(formEl)

      // Keep select values in sync with form data
      fd.set("schooling", schooling)
      fd.set("reading", reading)

      if (fileObj) {
        fd.append("attachment", fileObj, fileObj.name)
      }

      const res = await fetch("/api/applications/submit", {
        method: "POST",
        body: fd,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || "Failed to submit application")
      }

      setSuccess("Application submitted successfully. Thank you!")
      // Optionally reset form
      formEl.reset()
      setSchooling("")
      setReading("")
      setFileObj(null)
      setFileName("No file chosen")
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={inter.className}>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 md:px-6 py-12 md:py-16">
        <h1 className={`${oswald.className} text-[40px] leading-tight font-bold`} style={{ color: BRAND_HEADING }}>
          Application Form
        </h1>

        <form className="mt-8" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label className="block text-[13px] mb-2" style={{ color: BRAND_LABEL }}>
                Parent&apos;s Full Name <span className="text-[13px]">*</span>
              </label>
              <InputUnderline name="parentName" required placeholder="Enter parent’s full name" />
            </div>
            <div>
              <label className="block text-[13px] mb-2" style={{ color: BRAND_LABEL }}>
                Student&apos;s Full Name <span className="text-[13px]">*</span>
              </label>
              <InputUnderline name="studentName" required placeholder="Enter student’s full name" />
            </div>

            <div>
              <label className="block text-[13px] mb-2" style={{ color: BRAND_LABEL }}>
                Student&apos;s Age
              </label>
              <InputUnderline name="age" type="number" min={1} placeholder="Enter student’s age" />
            </div>
            <div>
              <label className="block text-[13px] mb-2" style={{ color: BRAND_LABEL }}>
                Schooling
              </label>
              <SelectUnderline
                options={["Elementary", "Middle School", "High School", "Homeschool", "Other"]}
                value={schooling}
                onChange={setSchooling}
                placeholder="Select schooling"
              />
              <input type="hidden" name="schooling" value={schooling} />
            </div>

            <div>
              <label className="block text-[13px] mb-2" style={{ color: BRAND_LABEL }}>
                Email
              </label>
              <InputUnderline name="email" type="email" placeholder="email@example.com" />
            </div>
            <div>
              <label className="block text-[13px] mb-2" style={{ color: BRAND_LABEL }}>
                Phone
              </label>
              <InputUnderline name="phone" type="tel" placeholder="(000) 000-0000" />
            </div>

            <div>
              <label className="block text-[13px] mb-2" style={{ color: BRAND_LABEL }}>
                Recent books read in math*
              </label>
              <InputUnderline name="recentBooks" required placeholder="List recent books" />
            </div>
            <div>
              <label className="block text-[13px] mb-2" style={{ color: BRAND_LABEL }}>
                Rate this student&apos;s engagement in reading*
              </label>
              <SelectUnderline
                options={["Low", "Medium", "High", "Very High"]}
                value={reading}
                onChange={setReading}
                placeholder="Select one"
              />
              <input type="hidden" name="reading" value={reading} />
            </div>
          </div>

          {/* Middle: two-column textareas */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label className="block text-[13px] mb-2" style={{ color: BRAND_LABEL }}>
                State specific examples, showing how your student approaches challenging work *
              </label>
              <TextareaUnderline name="approachExamples" required placeholder="Write here..." />
            </div>
            <div>
              <label className="block text-[13px] mb-2" style={{ color: BRAND_LABEL }}>
                Math courses completed *
              </label>
              <TextareaUnderline name="courses" required placeholder="Write here..." />
            </div>

            <div>
              <label className="block text-[13px] mb-2" style={{ color: BRAND_LABEL }}>
                Competitions/Contests taken (and results) *
              </label>
              <TextareaUnderline name="contests" required placeholder="Write here..." />
            </div>
            <div>
              <label className="block text-[13px] mb-2" style={{ color: BRAND_LABEL }}>
                Math circle/clubs/events attended *
              </label>
              <TextareaUnderline name="clubs" required placeholder="Write here..." />
            </div>
          </div>

          {/* Bottom: full width textarea */}
          <div className="mt-10">
            <label className="block text-[13px] mb-2" style={{ color: BRAND_LABEL }}>
              Anything else you would like us to know about your child and their interests?
            </label>
            <TextareaUnderline name="extra" placeholder="Write here..." className="min-h-[100px]" />
          </div>

          {/* Optional attachment (PDF) */}
          <div className="mt-10">
            <label className="block text-[13px] mb-2" style={{ color: BRAND_LABEL }}>
              Optional Attachment (PDF only)
            </label>
            <div className="flex items-center gap-4">
              <input
                ref={fileRef}
                type="file"
                accept="application/pdf"
                className="sr-only"
                name="attachment"
                onChange={onFileChange}
              />
              <button
                type="button"
                onClick={onPickFile}
                className="inline-flex items-center gap-2 rounded-md border border-[var(--btn)] px-4 py-2 text-[var(--btn)] hover:bg-[#eef1fb] transition"
                style={{ ["--btn" as any]: BRAND_BTN }}
              >
                <span>Upload File</span>
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-[13px] text-slate-500">{fileName}</p>
          </div>

          {/* Status messages */}
          <div className="mt-6 min-h-[24px]" aria-live="polite">
            {success && <p className="text-green-600">{success}</p>}
            {error && <p className="text-red-600">{error}</p>}
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-[420px] md:w-[480px] text-white py-6 text-base transition-colors"
              style={{ backgroundColor: BRAND_BTN }}
              onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = BRAND_BTN_HOVER)}
              onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = BRAND_BTN)}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </main>
      <SiteFooter />
    </div>
  )
}
