"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play, CheckCircle2 } from "lucide-react"

const highlights = ["Guided 7-step workflow", "AI-powered suggestions", "Professional exports"]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-28 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/4 right-0 h-[600px] w-[600px] rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-6">
            <Badge variant="secondary" className="w-fit gap-2 px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              Now with AI-powered assistance
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance">
              Design Impactful Education Programs
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Transform your ideas into structured, evidence-based programs using the Logical Framework Approach. A
              guided, gamified platform built for NGOs.
            </p>

            <ul className="flex flex-col gap-2">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button size="lg" asChild>
                <Link href="/register">
                  Start Designing Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#demo">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Demo
                </Link>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">No credit card required. Free for NGOs under 10 users.</p>
          </div>

          {/* Right Content - Visual */}
          <div className="relative lg:pl-8">
            <div className="relative rounded-xl border border-border bg-card p-2 shadow-2xl">
              <div className="rounded-lg bg-muted/50 p-4 md:p-6">
                {/* Mock Dashboard Preview */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <span className="text-lg">📚</span>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Rural Education Initiative</div>
                        <div className="text-sm text-muted-foreground">Step 4 of 7</div>
                      </div>
                    </div>
                    <Badge className="bg-accent text-accent-foreground">57% Complete</Badge>
                  </div>

                  {/* Progress Steps */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                      <div key={step} className={`h-2 flex-1 rounded-full ${step <= 4 ? "bg-primary" : "bg-muted"}`} />
                    ))}
                  </div>

                  {/* Mock Content */}
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-lg border border-border bg-card p-3">
                      <div className="text-xs font-medium text-muted-foreground mb-2">Problem Tree</div>
                      <div className="space-y-1.5">
                        <div className="h-3 w-full rounded bg-destructive/20" />
                        <div className="flex gap-1">
                          <div className="h-3 flex-1 rounded bg-muted" />
                          <div className="h-3 flex-1 rounded bg-muted" />
                        </div>
                        <div className="h-3 w-3/4 rounded bg-primary/20" />
                      </div>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-3">
                      <div className="text-xs font-medium text-muted-foreground mb-2">Stakeholders</div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-xs">
                          Teachers
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Parents
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Students
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          +5
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -right-4 top-8 rounded-lg border border-border bg-card p-3 shadow-lg animate-float hidden lg:block">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm">🏆</div>
                <div>
                  <div className="text-xs font-medium">Badge Earned!</div>
                  <div className="text-xs text-muted-foreground">Problem Analyst</div>
                </div>
              </div>
            </div>

            <div
              className="absolute -left-4 bottom-12 rounded-lg border border-border bg-card p-3 shadow-lg hidden lg:block"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-sm">💡</div>
                <div>
                  <div className="text-xs font-medium">AI Suggestion</div>
                  <div className="text-xs text-muted-foreground">Add baseline data</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
