"use client"

import { Target, Users, GitBranch, GitMerge, Workflow, Table, BarChart3, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const steps = [
  {
    number: 1,
    icon: Target,
    title: "Problem Definition",
    description: "Clearly articulate the central problem, its context, and who is affected.",
    color: "bg-red-500/10 text-red-600",
  },
  {
    number: 2,
    icon: Users,
    title: "Stakeholder Analysis",
    description: "Identify all stakeholders, their interests, influence, and expectations.",
    color: "bg-orange-500/10 text-orange-600",
  },
  {
    number: 3,
    icon: GitBranch,
    title: "Problem Tree",
    description: "Map the causes and effects of the problem in a visual tree structure.",
    color: "bg-yellow-500/10 text-yellow-600",
  },
  {
    number: 4,
    icon: GitMerge,
    title: "Objective Tree",
    description: "Transform problems into positive objectives and solutions.",
    color: "bg-green-500/10 text-green-600",
  },
  {
    number: 5,
    icon: Workflow,
    title: "Results Chain",
    description: "Build your Theory of Change showing inputs to outcomes pathway.",
    color: "bg-teal-500/10 text-teal-600",
  },
  {
    number: 6,
    icon: Table,
    title: "Logical Framework",
    description: "Create a complete Logframe Matrix with indicators and assumptions.",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    number: 7,
    icon: BarChart3,
    title: "Monitoring Framework",
    description: "Design M&E indicators, data collection, and reporting plans.",
    color: "bg-indigo-500/10 text-indigo-600",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Badge variant="outline" className="mb-4">
            The LFA Process
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4 text-balance">
            A Guided Journey Through Program Design
          </h2>
          <p className="text-lg text-muted-foreground">
            Follow our structured 7-step workflow based on the Logical Framework Approach, with built-in guidance and
            best practices at every stage.
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block lg:hidden" />
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border hidden lg:block -translate-x-1/2" />

          <div className="grid gap-8 md:gap-6">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative flex flex-col md:flex-row items-start gap-6 ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Step Card */}
                <div className={`flex-1 ${index % 2 === 1 ? "lg:text-right" : ""}`}>
                  <div
                    className={`inline-flex flex-col gap-4 p-6 rounded-xl border border-border bg-card ${
                      index % 2 === 1 ? "lg:items-end" : ""
                    }`}
                  >
                    <div className={`flex items-center gap-3 ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${step.color}`}>
                        <step.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-muted-foreground mb-0.5">Step {step.number}</div>
                        <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-md leading-relaxed">{step.description}</p>
                  </div>
                </div>

                {/* Center Number (Desktop) */}
                <div className="hidden lg:flex items-center justify-center w-12">
                  <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                    {step.number}
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="flex-1 hidden lg:block" />
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <a
            href="/register"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline underline-offset-4"
          >
            Start your first program design
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
