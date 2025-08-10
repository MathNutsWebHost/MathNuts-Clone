"use client"

import { bebas, inter } from "@/lib/fonts"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export default function ApplyPage() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className={inter.className}>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <h1 className={`${bebas.className} text-5xl text-[#1b306a] tracking-wide text-center`}>Apply</h1>
        <p className="text-center text-muted-foreground mt-3">
          Fill out the interest form and we&apos;ll follow up shortly.
        </p>

        {!submitted ? (
          <form
            className="grid gap-6 mt-10"
            onSubmit={(e) => {
              e.preventDefault()
              setSubmitted(true)
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="parent">Parent/Guardian Name</Label>
              <Input id="parent" required placeholder="Alex Johnson" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required placeholder="alex@example.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="student">Student Name</Label>
              <Input id="student" required placeholder="Jamie Johnson" />
            </div>
            <div className="grid gap-2">
              <Label>Grade</Label>
              <Select defaultValue="6">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 9 }, (_, i) => (i + 3).toString()).map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="interests">Interests & Goals</Label>
              <Textarea id="interests" placeholder="Tell us about the student’s interests, experience, and goals." />
            </div>
            <Button type="submit" className="w-full md:w-auto">
              Submit
            </Button>
          </form>
        ) : (
          <div className="mt-12 rounded-lg border p-6 text-center">
            <div className={`${bebas.className} text-3xl text-[#1b306a]`}>Thanks for applying!</div>
            <p className="text-muted-foreground mt-2">We&apos;ll reach out via email with next steps.</p>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
