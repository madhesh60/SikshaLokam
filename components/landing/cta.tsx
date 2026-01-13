"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2 } from "lucide-react"

const benefits = [
  "Free for NGOs under 10 users",
  "No credit card required",
  "Export unlimited reports",
  "Cancel anytime",
]

export function CTA() {
  return (
    <section className="py-20 md:py-28 bg-primary">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl mb-4 text-balance">
          Ready to Design Your Next Program?
        </h2>
        <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
          Join hundreds of NGOs using Shiksha Raha to create impactful, evidence-based education programs. Start your
          journey today.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-2 text-sm text-primary-foreground/90">
              <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
              {benefit}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            asChild
          >
            <Link href="/contact">Schedule a Demo</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
