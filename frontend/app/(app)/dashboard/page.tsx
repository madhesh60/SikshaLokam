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
  // Calculate total progress across all projects
  const totalProgress =
    projects.length > 0 ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length) : 0

  // Calculate total time spent (mock + real)
  const totalTimeSpent = projects.reduce((acc, p) => acc + (p.timeSpent || 0), 0) + 12 * 60 // Base 12 hours from previous mock
  const timeSpentHours = Math.round(totalTimeSpent / 60)

  const statusData = [
    { name: 'Draft', value: projects.filter(p => p.status === 'draft').length },
    { name: 'In Progress', value: projects.filter(p => p.status === 'in-progress').length },
    { name: 'Review', value: projects.filter(p => p.status === 'review').length },
    { name: 'Completed', value: projects.filter(p => p.status === 'completed').length },
  ].filter(d => d.value > 0);

  // Recommendation Logic
  const activeProject = recentProjects.find(p => p.status !== 'completed');
  const nextStep = activeProject ? LFA_STEPS.find(s => s.id === (activeProject.currentStep || 1)) : null;

  // Dynamic Action Items based on project state
  const getActionItem = (project: any) => {
    if (!project.data?.problemDefinition?.centralProblem) return { title: "Define Central Problem", step: "Problem Definition" }
    if (!project.data?.stakeholders?.length) return { title: "Map Stakeholders", step: "Stakeholder Analysis" }
    if (!project.data?.logframe?.goal?.narrative) return { title: "Set Goal", step: "Logical Framework" }
    return { title: "Continue Design", step: "General" }
  }

  const actionItem = activeProject ? getActionItem(activeProject) : null

  const recommendedAction = activeProject
    ? {
      title: `Continue: ${activeProject.name}`,
      description: `Action Required: ${actionItem?.title} in ${actionItem?.step}.`,
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
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">

      {/* Premium Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/90 to-indigo-600 p-8 md:p-12 text-white shadow-xl shadow-primary/20">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="h-64 w-64 text-white" />
        </div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur-md border border-white/20 mb-4 text-white">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            System Operational
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-heading">
            Welcome back, {user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-lg text-indigo-100 max-w-xl leading-relaxed">
            Your impact dashboard is ready. You have <span className="font-semibold text-white">{projects.filter(p => p.status === 'in-progress').length} active programs</span> requiring your attention today.
          </p>
          <div className="mt-8 flex gap-4">
            <Button onClick={() => setCreateDialogOpen(true)} size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg border-0 font-semibold">
              <Plus className="mr-2 h-5 w-5" />
              New Program
            </Button>
            <Link href="/team">
              <Button variant="outline" size="lg" className="bg-indigo-700/50 border-white/20 text-white hover:bg-indigo-700/70 hover:text-white backdrop-blur-md">
                <Users className="mr-2 h-5 w-5" />
                View Team
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-12">

        {/* Left Column: Stats & Projects (8 cols) */}
        <div className="lg:col-span-8 space-y-8">

          {/* Quick Stats Row */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <Card className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
                  <FolderOpen className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Programs</p>
                  <h3 className="text-2xl font-bold font-heading">{projects.length}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Hours Scoped</p>
                  <h3 className="text-2xl font-bold font-heading">{timeSpentHours}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Badges</p>
                  <h3 className="text-2xl font-bold font-heading">{earnedBadges.length}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Impact Score</p>
                  <h3 className="text-2xl font-bold font-heading">850</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-primary" />
                Recent Programs
              </h2>
              {projects.length > 0 && (
                <Link href="/projects" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center transition-colors">
                  View all <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              )}
            </div>

            {recentProjects.length === 0 ? (
              <Card className="border-dashed bg-muted/30">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="rounded-full bg-background p-6 mb-4 border shadow-sm ring-4 ring-muted/50">
                    <FolderOpen className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No programs yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    Start your journey by creating your first program design. It only takes a minute.
                  </p>
                  <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Program
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {recentProjects.map((project) => {
                  const currentStepData = LFA_STEPS.find((s) => s.id === project.currentStep)
                  const StepIcon = ((currentStepData && iconMap[currentStepData.icon]) || Target) as React.ElementType
                  const nextAction = getActionItem(project)

                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={project.id}
                    >
                      <Card
                        className="cursor-pointer group relative overflow-hidden border-border/50 hover:border-primary/50"
                        onClick={() => handleOpenProject(project)}
                      >
                        <div className="absolute inset-y-0 left-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom" />
                        <CardContent className="p-5">
                          <div className="flex items-start gap-5">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                              <StepIcon className="h-6 w-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">{project.name}</h3>
                                <Badge variant="secondary" className={`text-[10px] h-5 px-2 font-medium ${project.status === 'in-progress' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : ''}`}>
                                  {project.status.replace('-', ' ')}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground truncate mb-4">{project.description}</p>

                              <div className="grid gap-2">
                                <div className="flex justify-between text-xs font-medium">
                                  <span>Completion</span>
                                  <span>{project.progress}%</span>
                                </div>
                                <div className="h-2 bg-muted/50 rounded-full overflow-hidden flex">
                                  {[...Array(7)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={`flex-1 border-r border-background/50 last:border-0 transition-colors duration-500 ${i + 1 <= (project.currentStep || 0) ? 'bg-primary' : 'bg-muted'}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="self-center pl-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <ArrowRight className="h-4 w-4 text-primary" />
                              </div>
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
        </div>

        {/* Right Column: Recommended & Charts (4 cols) */}
        <div className="lg:col-span-4 space-y-8">

          {/* Recommendation Card */}
          <Card className="border-amber-200/50 dark:border-amber-800/50 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 blur-xl">
              <div className="h-32 w-32 rounded-full bg-amber-400" />
            </div>
            <CardHeader>
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold mb-2 text-sm uppercase tracking-wide">
                <Sparkles className="h-4 w-4" />
                <span>Suggested Next Step</span>
              </div>
              <CardTitle className="text-xl font-heading">{recommendedAction.title}</CardTitle>
              <CardDescription className="text-muted-foreground/80">{recommendedAction.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              {recommendedAction.action ? (
                <Button onClick={recommendedAction.action} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-lg shadow-amber-500/20">
                  <Zap className="mr-2 h-4 w-4 fill-current" />
                  {recommendedAction.buttonText}
                </Button>
              ) : (
                <Link href={recommendedAction.link} className="w-full">
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-lg shadow-amber-500/20">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    {recommendedAction.buttonText}
                  </Button>
                </Link>
              )}
            </CardFooter>
          </Card>

          {/* Program Health Chart */}
          <Card className="flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Program Health
              </CardTitle>
              <CardDescription>Overview of your program statuses</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-[220px] flex items-center justify-center">
              {projects.length > 0 ? (
                <div className="h-[200px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="stroke-background stroke-2" />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', padding: '8px 12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                    <span className="text-3xl font-bold text-foreground">{totalProgress}%</span>
                    <span className="text-xs text-muted-foreground uppercase font-medium tracking-wide mt-1">Completion</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground text-sm gap-2">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 opacity-30" />
                  </div>
                  <span>No analytics available</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                Quick Start Templates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {TEMPLATES.slice(0, 3).map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplate(template.id)
                    setCreateDialogOpen(true)
                  }}
                  className="w-full text-left p-3 rounded-xl border border-transparent bg-muted/30 hover:bg-muted hover:border-border transition-all group"
                >
                  <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{template.name}</div>
                  <div className="text-xs text-muted-foreground truncate opacity-70">{template.description}</div>
                </button>
              ))}
              <Link href="/templates" className="inline-flex items-center text-xs font-medium text-primary hover:underline pt-1">
                Browse all templates <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
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
