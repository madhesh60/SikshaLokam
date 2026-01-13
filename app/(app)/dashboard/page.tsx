"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useDemoStore, BADGES, LFA_STEPS, TEMPLATES } from "@/lib/demo-store"
import {
  Plus,
  ArrowRight,
  FolderOpen,
  Clock,
  Trophy,
  TrendingUp,
  Target,
  Users,
  GitBranch,
  GitMerge,
  Workflow,
  Table,
  BarChart3,
} from "lucide-react"
import type React from "react"
import { CreateProjectDialog } from "@/components/app/create-project-dialog"

const iconMap: Record<string, React.ElementType> = {
  target: Target,
  users: Users,
  "git-branch": GitBranch,
  "git-merge": GitMerge,
  workflow: Workflow,
  table: Table,
  "bar-chart": BarChart3,
}

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateFromUrl = searchParams.get("template")

  const { user, projects, badges, setCurrentProject, createProject } = useDemoStore()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>(templateFromUrl || undefined)

  // Auto-open create dialog if template is in URL
  useEffect(() => {
    if (templateFromUrl) {
      setSelectedTemplate(templateFromUrl)
      setCreateDialogOpen(true)
    }
  }, [templateFromUrl])

  const recentProjects = projects
    .slice()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3)

  const earnedBadges = BADGES.filter((b) => badges.includes(b.id))
  const totalProgress =
    projects.length > 0 ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length) : 0

  const handleOpenProject = (project: (typeof projects)[0]) => {
    setCurrentProject(project)
    router.push(`/projects/${project.id}/design`)
  }

  const handleCreateProject = (name: string, description: string, templateId?: string) => {
    const project = createProject(name, description, templateId)
    setCurrentProject(project)
    router.push(`/projects/${project.id}/design`)
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.name?.split(" ")[0]}!</h1>
          <p className="text-muted-foreground">
            {projects.length === 0
              ? "Start by creating your first program design."
              : "Continue working on your program designs."}
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Program
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Programs</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">
              {projects.filter((p) => p.status === "completed").length} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProgress}%</div>
            <Progress value={totalProgress} className="mt-2 h-1.5" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{earnedBadges.length}</div>
            <p className="text-xs text-muted-foreground">of {BADGES.length} available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.filter((p) => p.status === "in-progress" || p.status === "draft").length}
            </div>
            <p className="text-xs text-muted-foreground">active programs</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Programs</h2>
            {projects.length > 0 && (
              <Link href="/projects" className="text-sm text-primary hover:underline">
                View all
              </Link>
            )}
          </div>

          {recentProjects.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <FolderOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-1">No programs yet</h3>
                <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
                  Create your first program design to get started with the LFA workflow.
                </p>
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Program
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentProjects.map((project) => {
                const currentStepData = LFA_STEPS.find((s) => s.id === project.currentStep)
                const StepIcon = currentStepData ? iconMap[currentStepData.icon] : Target

                return (
                  <Card
                    key={project.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleOpenProject(project)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <StepIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-foreground truncate">{project.name}</h3>
                            <Badge
                              variant={
                                project.status === "completed"
                                  ? "default"
                                  : project.status === "in-progress"
                                    ? "secondary"
                                    : "outline"
                              }
                              className="shrink-0"
                            >
                              {project.status === "in-progress" ? "In Progress" : project.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate mb-2">{project.description}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 flex-1">
                              <Progress value={project.progress} className="h-1.5 flex-1" />
                              <span className="text-xs text-muted-foreground">{project.progress}%</span>
                            </div>
                            <span className="text-xs text-muted-foreground">Step {project.currentStep} of 7</span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick Actions & Badges */}
        <div className="space-y-6">
          {/* Quick Start */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Start</CardTitle>
              <CardDescription>Choose a template to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {TEMPLATES.slice(0, 3).map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplate(template.id)
                    setCreateDialogOpen(true)
                  }}
                  className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="font-medium text-sm text-foreground">{template.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{template.description}</div>
                </button>
              ))}
              <Link href="/templates" className="block text-center text-sm text-primary hover:underline pt-2">
                Browse all templates
              </Link>
            </CardContent>
          </Card>

          {/* Recent Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Badges</CardTitle>
              <CardDescription>
                {earnedBadges.length > 0 ? "Keep up the great work!" : "Complete steps to earn badges"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {earnedBadges.length === 0 ? (
                <div className="text-center py-4">
                  <Trophy className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Complete your first step to earn your first badge!</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {earnedBadges.slice(0, 6).map((badge) => (
                    <div
                      key={badge.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20"
                      title={badge.description}
                    >
                      <span>{badge.icon}</span>
                      <span className="text-xs font-medium">{badge.name}</span>
                    </div>
                  ))}
                </div>
              )}
              {earnedBadges.length > 0 && (
                <Link href="/achievements" className="block text-center text-sm text-primary hover:underline mt-4">
                  View all achievements
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreateProject={handleCreateProject}
        defaultTemplateId={selectedTemplate}
      />
    </div>
  )
}
