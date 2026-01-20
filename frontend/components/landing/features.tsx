"use client"

import { Target, GitBranch, Workflow, Table, BarChart3, Sparkles, FileDown, Users2, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Target,
    title: "7-Step Guided Workflow",
    description:
      "Follow a structured process from problem definition to monitoring framework with built-in guidance at every step.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Assistance",
    description:
      "Get smart suggestions, auto-completions, and consistency checks powered by AI to strengthen your program design.",
  },
  {
    icon: GitBranch,
    title: "Visual Problem & Objective Trees",
    description:
      "Build intuitive cause-effect diagrams and transform problems into objectives with drag-and-drop tools.",
  },
  {
    icon: Workflow,
    title: "Theory of Change Builder",
    description: "Create compelling results chains that clearly show the pathway from activities to long-term impact.",
  },
  {
    icon: Table,
    title: "Smart Logframe Matrix",
    description: "Auto-generate your Logical Framework Matrix with intelligent linking between components.",
  },
  {
    icon: BarChart3,
    title: "M&E Framework Setup",
    description: "Design comprehensive monitoring indicators with data collection plans and reporting schedules.",
  },
  {
    icon: FileDown,
    title: "Professional Exports",
    description: "Export your work as polished PDF reports, Word documents, Excel sheets, or presentations.",
  },
  {
    icon: Users2,
    title: "Real-time Collaboration",
    description: "Work together with your team in real-time with comments, version history, and role-based access.",
  },
  {
    icon: Shield,
    title: "Sector-Specific Templates",
    description: "Start quickly with pre-built templates for education, health, livelihoods, and more sectors.",
  },
]

const stats = [
  { value: "500+", label: "NGOs Using Platform" },
  { value: "2,000+", label: "Programs Designed" },
  { value: "50+", label: "Templates Available" },
  { value: "15M+", label: "Beneficiaries Reached" },
]

export function Features() {
  return (
    <section id="features" className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4 text-balance">
            Everything You Need to Design Effective Programs
          </h2>
          <p className="text-lg text-muted-foreground">
            A complete toolkit for NGO program managers to create evidence-based, fundable program designs using the
            Logical Framework Approach.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 bg-card hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="rounded-2xl bg-primary p-8 md:p-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary-foreground mb-2">{stat.value}</div>
                <div className="text-sm text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
