"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useDemoStore, LFA_STEPS } from "@/lib/demo-store"
import {
  Plus,
  Search,
  MoreVertical,
  Trash2,
  FileDown,
  FolderOpen,
  Target,
  Users,
  GitBranch,
  GitMerge,
  Workflow,
  Table,
  BarChart3,
  Calendar,
  Clock,
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

const statusColors = {
  draft: "bg-muted text-muted-foreground",
  "in-progress": "bg-primary/10 text-primary",
  review: "bg-accent/20 text-accent-foreground",
  completed: "bg-green-500/10 text-green-700",
}

export default function ProjectsPage() {
  const router = useRouter()
  const { projects, setCurrentProject, deleteProject } = useDemoStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sortedProjects = [...filteredProjects].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )

  const handleOpenProject = (project: (typeof projects)[0]) => {
    setCurrentProject(project)
    router.push(`/projects/${project.id}/design`)
  }

  const handleDeleteProject = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete)
      setProjectToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleCreateProject = (name: string, description: string, templateId?: string) => {
    const { createProject } = useDemoStore.getState()
    const project = createProject(name, description, templateId)
    setCurrentProject(project)
    router.push(`/projects/${project.id}/design`)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Programs</h1>
          <p className="text-muted-foreground">Manage and continue your program designs</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Program
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search programs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Projects Grid */}
      {sortedProjects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4">
              <FolderOpen className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">
              {searchQuery ? "No programs found" : "No programs yet"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
              {searchQuery
                ? "Try adjusting your search query"
                : "Create your first program design to get started with the LFA workflow."}
            </p>
            {!searchQuery && (
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Program
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedProjects.map((project) => {
            const currentStepData = LFA_STEPS.find((s) => s.id === project.currentStep)
            const StepIcon = currentStepData ? iconMap[currentStepData.icon] : Target

            return (
              <Card
                key={project.id}
                className="group cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleOpenProject(project)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <StepIcon className="h-6 w-6 text-primary" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleOpenProject(project)
                          }}
                        >
                          Continue Editing
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <FileDown className="mr-2 h-4 w-4" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            setProjectToDelete(project.id)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{project.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className={statusColors[project.status]}>
                        {project.status === "in-progress" ? "In Progress" : project.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Step {project.currentStep}/7</span>
                    </div>

                    <Progress value={project.progress} className="h-1.5" />

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(project.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Updated {formatDate(project.updatedAt)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Create Dialog */}
      <CreateProjectDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreateProject={handleCreateProject}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Program</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this program? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
