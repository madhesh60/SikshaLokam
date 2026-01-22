"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
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
  Lightbulb,
  MoreHorizontal,
  Sparkles,
  Zap,
} from "lucide-react"
import type React from "react"
import { CreateProjectDialog } from "@/components/app/create-project-dialog"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts'
import { motion } from "framer-motion"

const iconMap: Record<string, React.ElementType> = {
  target: Target,
  users: Users,
  "git-branch": GitBranch,
  "git-merge": GitMerge,
  workflow: Workflow,
  table: Table,
  "bar-chart": BarChart3,
}

const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#6366f1'];

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateFromUrl = searchParams.get("template")

  const { user, projects, badges, setCurrentProject, createProject, fetchProjects } = useDemoStore()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>(templateFromUrl || undefined)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchProjects()
  }, [])

  useEffect(() => {
    if (templateFromUrl) {
      setSelectedTemplate(templateFromUrl)
      setCreateDialogOpen(true)
    }
  }, [templateFromUrl])

  if (!mounted) return null

  const recentProjects = projects
    .slice()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3)

  const earnedBadges = BADGES.filter((b) => badges.includes(b.id))
  const totalProgress =
    projects.length > 0 ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length) : 0

  const statusData = [
    { name: 'Draft', value: projects.filter(p => p.status === 'draft').length },
    { name: 'In Progress', value: projects.filter(p => p.status === 'in-progress').length },
    { name: 'Review', value: projects.filter(p => p.status === 'review').length },
    { name: 'Completed', value: projects.filter(p => p.status === 'completed').length },
  ].filter(d => d.value > 0);

  // Recommendation Logic
  const activeProject = recentProjects.find(p => p.status !== 'completed');
  const nextStep = activeProject ? LFA_STEPS.find(s => s.id === (activeProject.currentStep || 1)) : null;
  const recommendedAction = activeProject
    ? {
      title: `Continue: ${activeProject.name}`,
      description: `You're currently on Step ${activeProject.currentStep}: ${nextStep?.name}. Complete this to move forward.`,
      link: `/projects/${activeProject.id}/design`,
      buttonText: "Resume Work"
    }
    : {
      title: "Start a New Impact Journey",
      description: "You have no active projects. Identify a new educational challenge to solve.",
      link: "#",
      action: () => setCreateDialogOpen(true),
      buttonText: "Create Project"
    }

  const handleOpenProject = (project: (typeof projects)[0]) => {
    setCurrentProject(project)
    router.push(`/projects/${project.id}/design`)
  }

  const handleCreateProject = async (name: string, description: string, templateId?: string) => {
    const project = await createProject(name, description, templateId)
    if (project) {
      setCurrentProject(project)
      router.push(`/projects/${project.id}/design`)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Header & Welcome */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-amber-500">
            Welcome back, {user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your programs today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Users className="h-4 w-4" />
            Team View
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)} className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 shadow-lg shadow-indigo-500/20">
            <Plus className="mr-2 h-4 w-4" />
            New Program
          </Button>
        </div>
      </div>

      {/* Insights & Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {/* Main Insight / Action Card */}
        <Card className="col-span-1 lg:col-span-2 border-primary/20 bg-gradient-to-br from-card to-primary/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Sparkles className="h-32 w-32" />
          </div>
          <CardHeader>
            <div className="flex items-center gap-2 text-amber-500 font-medium mb-1">
              <Lightbulb className="h-4 w-4" />
              <span>Recommended Action</span>
            </div>
            <CardTitle className="text-xl">{recommendedAction.title}</CardTitle>
            <CardDescription className="text-base">{recommendedAction.description}</CardDescription>
          </CardHeader>
          <CardFooter>
            {recommendedAction.action ? (
              <Button onClick={recommendedAction.action} className="gap-2">
                <Zap className="h-4 w-4 fill-current" />
                {recommendedAction.buttonText}
              </Button>
            ) : (
              <Link href={recommendedAction.link}>
                <Button className="gap-2">
                  <ArrowRight className="h-4 w-4" />
                  {recommendedAction.buttonText}
                </Button>
              </Link>
            )}
          </CardFooter>
        </Card>

        {/* Program Health Chart */}
        <Card className="col-span-1 flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              Program Health
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-[160px]">
            {projects.length > 0 ? (
              <div className="h-[160px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                  <span className="text-2xl font-bold">{totalProgress}%</span>
                  <span className="text-xs text-muted-foreground">Avg. Completion</span>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:border-primary/50 transition-colors">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <FolderOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Programs</p>
              <h3 className="text-2xl font-bold">{projects.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Time Spent</p>
              <h3 className="text-2xl font-bold">12<span className="text-sm font-normal text-muted-foreground ml-1">hrs</span></h3>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Badges Earned</p>
              <h3 className="text-2xl font-bold">{earnedBadges.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Impact Score</p>
              <h3 className="text-2xl font-bold">850</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Projects List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-primary" />
              Recent Programs
            </h2>
            {projects.length > 0 && (
              <Link href="/projects" className="text-sm text-primary hover:underline flex items-center">
                View all <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            )}
          </div>

          {recentProjects.length === 0 ? (
            <Card className="border-dashed bg-muted/30">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-background p-4 mb-4 border shadow-sm">
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
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={project.id}
                  >
                    <Card
                      className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all group"
                      onClick={() => handleOpenProject(project)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <StepIcon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">{project.name}</h3>
                              <Badge variant="outline" className="text-[10px] h-5">
                                {project.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground truncate mb-3">{project.description}</p>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 flex-1">
                                <Progress value={project.progress} className="h-1.5 flex-1" />
                                <span className="text-xs text-muted-foreground font-mono">{project.progress}%</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <span className="font-medium text-foreground">Step {project.currentStep}</span>: {currentStepData?.name}
                              </div>
                            </div>
                          </div>
                          <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon">
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>

        {/* Templates & Quick Access */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                Quick Start Templates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {TEMPLATES.slice(0, 3).map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplate(template.id)
                    setCreateDialogOpen(true)
                  }}
                  className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50 transition-all hover:border-primary/30 group"
                >
                  <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{template.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{template.description}</div>
                </button>
              ))}
              <Link href="/templates" className="block text-center text-sm text-primary hover:underline pt-2">
                Browse all templates
              </Link>
            </CardContent>
          </Card>

          {/* Badges Preview */}
          <Card className="bg-gradient-to-br from-card to-indigo-500/5 border-l-4 border-l-indigo-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                <span>Achievements</span>
                <Trophy className="h-4 w-4 text-indigo-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                {BADGES.slice(0, 4).map(badge => {
                  const isEarned = badges.includes(badge.id);
                  return (
                    <div key={badge.id} className={`aspect-square rounded-lg flex items-center justify-center text-2xl border ${isEarned ? 'bg-amber-100 border-amber-200' : 'bg-muted/50 border-transparent grayscale opacity-50'}`} title={badge.name}>
                      {badge.icon}
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 text-xs text-center text-muted-foreground">
                {earnedBadges.length} of {BADGES.length} badges earned
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CreateProjectDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreateProject={handleCreateProject}
        defaultTemplateId={selectedTemplate}
      />
    </div>
  )
}
