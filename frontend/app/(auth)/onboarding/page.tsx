"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useDemoStore, LFA_STEPS } from "@/lib/demo-store"
import {
  Target,
  Users,
  GitBranch,
  GitMerge,
  Workflow,
  Table,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Rocket,
  CheckCircle2,
} from "lucide-react"

const iconMap: Record<string, React.ElementType> = {
  target: Target,
  users: Users,
  "git-branch": GitBranch,
  "git-merge": GitMerge,
  workflow: Workflow,
  table: Table,
  "bar-chart": BarChart3,
}

const onboardingSteps = [
  {
    id: "welcome",
    title: "Welcome to Shiksha Raha!",
    description: "Let us guide you through the platform and help you design your first program.",
    content: "welcome",
  },
  {
    id: "lfa-intro",
    title: "The Logical Framework Approach",
    description: "LFA is a structured methodology used worldwide for designing, monitoring, and evaluating programs.",
    content: "lfa-intro",
  },
  {
    id: "workflow",
    title: "Your 7-Step Journey",
    description: "We will guide you through each step with templates, examples, and AI assistance.",
    content: "workflow",
  },
  {
    id: "features",
    title: "Powerful Features",
    description: "Discover the tools that will help you create impactful programs.",
    content: "features",
  },
  {
    id: "ready",
    title: "You are All Set!",
    description: "Start with a template or create your program from scratch.",
    content: "ready",
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get("template")

  const { user, completeOnboarding, isOnboarded } = useDemoStore()
  const [currentStep, setCurrentStep] = useState(0)

  // Redirect logic
  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else if (isOnboarded) {
      router.push("/dashboard")
    }
  }, [user, isOnboarded, router])

  if (!user || isOnboarded) return null

  const progress = ((currentStep + 1) / onboardingSteps.length) * 100
  const step = onboardingSteps[currentStep]

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    completeOnboarding()
    const redirectUrl = templateId ? `/dashboard?template=${templateId}` : "/dashboard"
    router.push(redirectUrl)
  }

  const handleSkip = () => {
    completeOnboarding()
    router.push("/dashboard")
  }

  const renderContent = () => {
    switch (step.content) {
      case "welcome":
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Hello, {user.name}!</h3>
              <p className="text-muted-foreground">
                Thank you for joining Shiksha Raha. We are excited to help you design impactful education programs for
                your organization, <span className="font-medium text-foreground">{user.organization}</span>.
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-left">
              <p className="text-sm text-muted-foreground">
                This quick tour will take about <span className="font-medium">2 minutes</span> and will help you
                understand how to use the platform effectively.
              </p>
            </div>
          </div>
        )

      case "lfa-intro":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-accent" />
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                The <span className="font-medium text-foreground">Logical Framework Approach (LFA)</span> helps you:
              </p>
              <ul className="space-y-3">
                {[
                  "Define clear problems and objectives",
                  "Map stakeholders and their needs",
                  "Design evidence-based interventions",
                  "Create measurable indicators",
                  "Build fundable proposals",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )

      case "workflow":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center mb-6">
              You will progress through these 7 steps to create a complete program design:
            </p>
            <div className="grid gap-2">
              {LFA_STEPS.map((lfaStep) => {
                const Icon = iconMap[lfaStep.icon] || Target
                return (
                  <div
                    key={lfaStep.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground">{lfaStep.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{lfaStep.description}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">Step {lfaStep.id}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )

      case "features":
        return (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: Sparkles,
                  title: "AI Assistance",
                  description: "Get smart suggestions and auto-completions",
                },
                {
                  icon: BookOpen,
                  title: "Templates",
                  description: "Start with sector-specific templates",
                },
                {
                  icon: Users,
                  title: "Collaboration",
                  description: "Work together with your team",
                },
                {
                  icon: BarChart3,
                  title: "Progress Tracking",
                  description: "Earn badges as you complete steps",
                },
              ].map((feature, index) => (
                <div key={index} className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/30">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="text-sm font-medium text-foreground mb-1">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        )

      case "ready":
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Rocket className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Start!</h3>
              <p className="text-muted-foreground">
                You can start with a template or create your program from scratch. Do not worry - you can always change
                your approach later.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleComplete}>
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-2xl border-border/50 shadow-lg">
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-muted-foreground">
            Step {currentStep + 1} of {onboardingSteps.length}
          </span>
          <button onClick={handleSkip} className="text-xs text-muted-foreground hover:text-foreground">
            Skip tour
          </button>
        </div>
        <Progress value={progress} className="h-1.5 mb-6" />
        <CardTitle className="text-xl">{step.title}</CardTitle>
        <CardDescription>{step.description}</CardDescription>
      </CardHeader>

      <CardContent className="pt-6 pb-8">{renderContent()}</CardContent>

      {step.content !== "ready" && (
        <div className="px-6 pb-6 flex justify-between">
          <Button variant="ghost" onClick={handlePrevious} disabled={currentStep === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </Card>
  )
}

