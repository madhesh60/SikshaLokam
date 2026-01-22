"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { useDemoStore, LFA_STEPS } from "@/lib/demo-store"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Target,
  Users,
  GitBranch,
  GitMerge,
  Workflow,
  Table,
  BarChart3,
  ArrowLeft,
  ArrowRight,
  Save,
  CheckCircle2,
  Sparkles,
} from "lucide-react"

import { Step1ProblemDefinition } from "@/components/design-steps/step-1-problem-definition"
import { Step2StakeholderAnalysis } from "@/components/design-steps/step-2-stakeholder-analysis"
import { Step3ProblemTree } from "@/components/design-steps/step-3-problem-tree"
import { Step4ObjectiveTree } from "@/components/design-steps/step-4-objective-tree"
import { Step5ResultsChain } from "@/components/design-steps/step-5-results-chain"
import { Step6LogicalFramework } from "@/components/design-steps/step-6-logical-framework"
import { Step7MonitoringFramework } from "@/components/design-steps/step-7-monitoring-framework"
import type React from "react"

const iconMap: Record<string, any> = {
  target: Target,
  users: Users,
  "git-branch": GitBranch,
  "git-merge": GitMerge,
  workflow: Workflow,
  table: Table,
  "bar-chart": BarChart3,
}

const stepComponents: Record<number, React.ComponentType<{ projectId: string; onNext?: () => void }>> = {
  1: Step1ProblemDefinition,
  2: Step2StakeholderAnalysis,
  3: Step3ProblemTree,
  4: Step4ObjectiveTree,
  5: Step5ResultsChain,
  6: Step6LogicalFramework,
  7: Step7MonitoringFramework,
}

import { CollaborationPanel } from "@/components/app/collaboration-panel"

export default function DesignPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const { projects, setCurrentProject, updateProject, trackTime } = useDemoStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSaving, setIsSaving] = useState(false)

  // Time Tracking: Add 1 minute every 60 seconds while on this page
  useEffect(() => {
    const timer = setInterval(() => {
      trackTime(projectId, 1)
    }, 60000)
    return () => clearInterval(timer)
  }, [projectId, trackTime])

  const project = projects.find((p) => p.id === projectId)

  /* 
   * Initialization Logic:
   * We only want to set the current step from the project state ONCE when the project is first loaded.
   * If we do this on every 'project' update, typing in a form (which updates 'project' via optimistic UI)
   * will trigger this effect and force-reset the user to 'project.currentStep', jumping them away 
   * if they navigated to a different step manually.
   */
  const initialized = useRef(false)

  useEffect(() => {
    if (project && !initialized.current) {
      setCurrentProject(project)
      setCurrentStep(project.currentStep || 1)
      initialized.current = true
    }
  }, [project, setCurrentProject])

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-semibold mb-2">Project not found</h2>
        <p className="text-muted-foreground mb-4">The project you are looking for does not exist.</p>
        <Button onClick={() => router.push("/projects")}>Go to Projects</Button>
      </div>
    )
  }

  const handleStepClick = (stepId: number) => {
    // Allow navigation to any completed step or the current step
    if (stepId <= project.currentStep + 1) {
      setCurrentStep(stepId)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleNext = () => {
    if (currentStep < 7) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)

      // Update project's current step if advancing
      if (nextStep > project.currentStep) {
        updateProject(projectId, { currentStep: nextStep })
      }
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSaving(false)
  }

  const StepComponent = stepComponents[currentStep]
  const currentStepData = LFA_STEPS.find((s) => s.id === currentStep)

  return (
    <TooltipProvider>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push("/projects")} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-foreground leading-none">{project.name}</h1>
                <Badge variant="outline" className="text-xs font-normal py-0 h-5">
                  Step {currentStep}/7: {currentStepData?.name}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{currentStepData?.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-7 text-xs border-dashed gap-1">
              <Users className="h-3 w-3" />
              Share
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className={`h-7 text-xs gap-1 ${project.status === 'completed' ? 'text-green-600 border-green-200 bg-green-50' :
                  project.status === 'review' ? 'text-purple-600 border-purple-200 bg-purple-50' :
                    project.status === 'draft' ? 'text-slate-600 border-slate-200' : 'text-blue-600 border-blue-200 bg-blue-50'
                  }`}>
                  <div className={`h-2 w-2 rounded-full ${project.status === 'completed' ? 'bg-green-500' :
                    project.status === 'review' ? 'bg-purple-500' :
                      project.status === 'draft' ? 'bg-slate-500' : 'bg-blue-500'
                    }`} />
                  <span className="capitalize">{project.status === 'in-progress' ? 'In Progress' : project.status}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => updateProject(projectId, { status: 'draft' })}>Draft</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateProject(projectId, { status: 'in-progress' })}>In Progress</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateProject(projectId, { status: 'review' })}>Ready for Review</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateProject(projectId, { status: 'completed' })}>Approved / Completed</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving} className="h-7 text-xs">
              <Save className="mr-2 h-3 w-3" />
              {isSaving ? "Saving..." : "Save"}
            </Button>

            <CollaborationPanel projectId={projectId} currentStep={currentStep} />
          </div>
        </div>

        {/* Step Navigation */}
        <div className="flex items-center justify-center gap-1 mb-2 overflow-x-auto pb-2">
          {LFA_STEPS.map((step, index) => {
            const Icon = iconMap[step.icon] || Target
            const isActive = step.id === currentStep
            const isCompleted = step.id < project.currentStep + 1
            const isAccessible = step.id <= project.currentStep + 1

            return (
              <Tooltip key={step.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleStepClick(step.id)}
                    disabled={!isAccessible}
                    className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition-colors min-w-[60px] ${isActive
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : isAccessible
                          ? "hover:bg-muted text-muted-foreground"
                          : "text-muted-foreground/40 cursor-not-allowed"
                      }`}
                  >
                    <div className="relative">
                      <Icon className="h-4 w-4" />
                      {isCompleted && step.id < currentStep && (
                        <CheckCircle2 className="absolute -top-1 -right-1 h-2.5 w-2.5 text-primary fill-primary-foreground" />
                      )}
                    </div>
                    <span className="text-[10px] font-medium hidden sm:block leading-tight text-center px-1 truncate w-full">
                      {step.name}
                    </span>
                    <span className="text-xs sm:hidden">{step.id}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="font-medium">{step.name}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto rounded-lg border border-border bg-card p-4">
          {currentStep > 7 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p>Redirecting to review...</p>
              {/* Force redirect if it lingers */}
              {void router.push(`/projects/${projectId}/review`)}
            </div>
          ) : StepComponent ? (
            <StepComponent projectId={projectId} onNext={handleNext} />
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              Component for step {currentStep} not found.
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {currentStep < 7 ? (
              <Button onClick={handleNext}>
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={() => router.push(`/projects/${projectId}/review`)}>
                Complete & Review
                <CheckCircle2 className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider >
  )
}
