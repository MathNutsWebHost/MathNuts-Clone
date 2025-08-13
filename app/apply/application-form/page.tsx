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
  required = false,
}: {
  options: string[]
  placeholder?: string
  value?: string
  onChange?: (val: string) => void
  required?: boolean
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={[
          "w-full bg-[#f7f8fc] px-3 py-2 text-left border-0 border-b border-[var(--underline)] rounded-none focus:outline-none focus:ring-0 focus:border-[var(--heading)]",
          !value && required ? "border-red-500" : "",
        ].join(" ")}
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
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

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

  function validateForm(formData: FormData): Record<string, string> {
    const errors: Record<string, string> = {}

    // Required fields validation
    const requiredFields = {
      parentName: "Parent's Full Name",
      studentName: "Student's Full Name",
      email: "Email",
      recentBooks: "Recent books read in math",
      reading: "Rate this student's engagement in reading",
      approachExamples: "State specific examples, showing how your student approaches challenging work",
      courses: "Math courses completed",
      contests: "Competitions/Contests taken (and results)",
      clubs: "Math circle/clubs/events attended",
    }

    for (const [field, label] of Object.entries(requiredFields)) {
      const value = field === "reading" ? reading : formData.get(field)
      if (!value || (typeof value === "string" && value.trim() === "")) {
        errors[field] = `${label} is required`
      }
    }

    // Email validation
    const email = formData.get("email") as string
    if (email && !email.includes("@")) {
      errors.email = "Please enter a valid email address"
    }

    // Phone number validation (optional but must be valid if provided)
    const phone = formData.get("phone") as string
    if (phone && phone.trim()) {
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$|^[$$]?[\d\s\-($$]{10,}$/
      if (!phoneRegex.test(phone.replace(/[\s\-$$$$]/g, ""))) {
        errors.phone = "Please enter a valid phone number"
      }
    }

    return errors
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSuccess(null)
    setError(null)
    setValidationErrors({})

    const formEl = e.currentTarget
    const fd = new FormData(formEl)

    // Keep select values in sync with form data
    fd.set("schooling", schooling)
    fd.set("reading", reading)

    // Validate form
    const errors = validateForm(fd)
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      setError("Please fill in all required fields correctly.")
      return
    }

    setIsSubmitting(true)

    try {
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
      // Don't reset the form, just clear validation errors
      setValidationErrors({})
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
                Parent&apos;s Full Name <span className="text-red-500">*</span>
              </label>
              <InputUnderline
                name="parentName"
                required
                placeholder="Enter parent's full name"
                className={validationErrors.parentName ? "border-red-500" : ""}
              />
              {validationErrors.parentName && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.parentName}</p>
              )}
            </div>
            <div>
              <label className="block text-[13px] mb-2" style={{ color: BRAND_LABEL }}>
                Student&apos;s Full Name <span className="text-red-500">*</span>
              </label>
              <InputUnderline
                name="studentName"
                required
                placeholder="Enter student's full name"
                className={validationErrors.studentName ? "border-red-500" : ""}
              />
              {validationErrors.studentName && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.studentName}</p>
              )}
            </div>

            <div>
              <label className="block text-[13px] mb-2" style={{ color: BRAND_LABEL }}>
                Student&apos;s Age
              </label>
              <InputUnderline name="age" type="number" min={1} placeholder="Enter student's age" />
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
                Email <span className="text-red-500">*</span>
              </label>
              <InputUnderline
                name="email"
                type="email"
                required
                placeholder="email@example.com"
                className={validationErrors.email ? "border-red-500" : ""}
              />
              {validationErrors.email && <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>}
            </div>
            <div>
              <label className="block text-[13px] mb-2" style={{ color: BRAND_LABEL }}>
                Phone
              </label>
              <InputUnderline
                name="phone"
                type="tel"
                placeholder="(000) 000-0000"
                className={validationErrors.phone ? "border-red-500" : ""}
              />
              {validationErrors.phone && <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>}
            </div>

            <div>
              <label className="block text-[13px] mb-2" style={{ color: BRAND_LABEL }}>
                Recent books read in math <span className="text-red-500">*</span>
              </label>
              <InputUnderline
                name="recentBooks"
                required
                placeholder="List recent books"
                className={validationErrors.recentBooks ? "border-red-500" : ""}
              />
              {validationErrors.recentBooks && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.recentBooks}</p>
              )}
            </div>
            <div>
              <label className="block text-[13px] mb-2" style={{ color: BRAND_LABEL }}>
                Rate this student&apos;s engagement in reading <span className="text-red-500">*</span>
              </label>
              <SelectUnderline
                options={["Low", "Medium", "High", "Very High"]}
                value={reading}
                onChange={setReading}
                placeholder="Select one"
                required
              />
              <input type="hidden" name="reading" value={reading} />
              {validationErrors.reading && <p className="text-red-500 text-xs mt-1">{validationErrors.reading}</p>}
            </div>
          </div>

          {/* Middle: two-column textareas */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label className="block text-[13px] mb-2" style={{ color: BRAND_LABEL }}>
                State specific examples, showing how your student approaches challenging work{" "}
                <span className="text-red-500">*</span>
              </label>
              <TextareaUnderline
                name="approachExamples"
                required
                placeholder="Write here..."
                className={validationErrors.approachExamples ? "border-red-500" : ""}
              />
              {validationErrors.approachExamples && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.approachExamples}</p>
              )}
            </div>
            <div>
              <label className="block text-[13px] mb-2" style={{ color: BRAND_LABEL }}>
                Math courses completed <span className="text-red-500">*</span>
              </label>
              <TextareaUnderline
                name="courses"
                required
                placeholder="Write here..."
                className={validationErrors.courses ? "border-red-500" : ""}
              />
              {validationErrors.courses && <p className="text-red-500 text-xs mt-1">{validationErrors.courses}</p>}
            </div>

            <div>
              <label className="block text-[13px] mb-2" style={{ color: BRAND_LABEL }}>
                Competitions/Contests taken (and results) <span className="text-red-500">*</span>
              </label>
              <TextareaUnderline
                name="contests"
                required
                placeholder="Write here..."
                className={validationErrors.contests ? "border-red-500" : ""}
              />
              {validationErrors.contests && <p className="text-red-500 text-xs mt-1">{validationErrors.contests}</p>}
            </div>
            <div>
              <label className="block text-[13px] mb-2" style={{ color: BRAND_LABEL }}>
                Math circle/clubs/events attended <span className="text-red-500">*</span>
              </label>
              <TextareaUnderline
                name="clubs"
                required
                placeholder="Write here..."
                className={validationErrors.clubs ? "border-red-500" : ""}
              />
              {validationErrors.clubs && <p className="text-red-500 text-xs mt-1">{validationErrors.clubs}</p>}
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
            {success && <p className="text-green-600 text-center font-medium">{success}</p>}
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
