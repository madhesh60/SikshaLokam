"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDemoStore } from "@/lib/demo-store"
import { Plus, Trash2, ArrowUp, ArrowDown, Sparkles, GitBranch } from "lucide-react"

interface Props {
  projectId: string
}

type TreeItem = { id: string; text: string; parentId?: string }

export function Step3ProblemTree({ projectId }: Props) {
  const { projects, updateProjectData, updateProgress } = useDemoStore()
  const project = projects.find((p) => p.id === projectId)

  const [centralProblem, setCentralProblem] = useState("")
  const [causes, setCauses] = useState<TreeItem[]>([])
  const [effects, setEffects] = useState<TreeItem[]>([])

  useEffect(() => {
    if (project?.data.problemTree) {
      setCentralProblem(project.data.problemTree.centralProblem || "")
      setCauses(project.data.problemTree.causes || [])
      setEffects(project.data.problemTree.effects || [])
    } else if (project?.data.problemDefinition?.centralProblem) {
      setCentralProblem(project.data.problemDefinition.centralProblem)
    }
  }, [project?.data.problemTree, project?.data.problemDefinition])

  const saveData = (newCentralProblem: string, newCauses: TreeItem[], newEffects: TreeItem[]) => {
    updateProjectData(projectId, "problemTree", {
      centralProblem: newCentralProblem,
      causes: newCauses,
      effects: newEffects,
    })
  }

  const handleAddCause = () => {
    const newCause: TreeItem = { id: crypto.randomUUID(), text: "" }
    const updated = [...causes, newCause]
    setCauses(updated)
    saveData(centralProblem, updated, effects)
  }

  const handleAddEffect = () => {
    const newEffect: TreeItem = { id: crypto.randomUUID(), text: "" }
    const updated = [...effects, newEffect]
    setEffects(updated)
    saveData(centralProblem, causes, updated)
  }

  const handleUpdateCause = (id: string, text: string) => {
    const updated = causes.map((c) => (c.id === id ? { ...c, text } : c))
    setCauses(updated)
    saveData(centralProblem, updated, effects)
  }

  const handleUpdateEffect = (id: string, text: string) => {
    const updated = effects.map((e) => (e.id === id ? { ...e, text } : e))
    setEffects(updated)
    saveData(centralProblem, causes, updated)
  }

  const handleRemoveCause = (id: string) => {
    const updated = causes.filter((c) => c.id !== id)
    setCauses(updated)
    saveData(centralProblem, updated, effects)
  }

  const handleRemoveEffect = (id: string) => {
    const updated = effects.filter((e) => e.id !== id)
    setEffects(updated)
    saveData(centralProblem, causes, updated)
  }

  const handleCentralProblemChange = (value: string) => {
    setCentralProblem(value)
    saveData(value, causes, effects)
  }

  const handleComplete = () => {
    updateProgress(projectId, 3)
  }

  const isComplete = centralProblem && causes.length >= 2 && effects.length >= 2

  return (
    <div className="space-y-6">
      {/* Tips */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Problem Tree Guidance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The Problem Tree visualizes the cause-effect relationships. Place the central problem in the middle, root
            causes below (the "roots"), and effects above (the "branches"). Ask "Why?" for causes and "So what?" for
            effects.
          </p>
        </CardContent>
      </Card>

      {/* Tree Visualization */}
      <div className="space-y-6">
        {/* Effects (Top) */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowUp className="h-5 w-5 text-destructive" />
                <CardTitle className="text-lg">Effects</CardTitle>
                <Badge variant="outline">{effects.length}</Badge>
              </div>
              <Button variant="outline" size="sm" onClick={handleAddEffect}>
                <Plus className="mr-2 h-4 w-4" />
                Add Effect
              </Button>
            </div>
            <CardDescription>What are the consequences of the central problem?</CardDescription>
          </CardHeader>
          <CardContent>
            {effects.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Add at least 2 effects of the central problem
              </p>
            ) : (
              <div className="space-y-3">
                {effects.map((effect, index) => (
                  <div key={effect.id} className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                    <Input
                      placeholder="e.g., Higher school dropout rates"
                      value={effect.text}
                      onChange={(e) => handleUpdateEffect(effect.id, e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveEffect(effect.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Central Problem */}
        <Card className="border-2 border-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Central Problem</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Input
              value={centralProblem}
              onChange={(e) => handleCentralProblemChange(e.target.value)}
              className="text-center font-medium"
              placeholder="The main problem your program addresses"
            />
          </CardContent>
        </Card>

        {/* Causes (Bottom) */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowDown className="h-5 w-5 text-accent" />
                <CardTitle className="text-lg">Root Causes</CardTitle>
                <Badge variant="outline">{causes.length}</Badge>
              </div>
              <Button variant="outline" size="sm" onClick={handleAddCause}>
                <Plus className="mr-2 h-4 w-4" />
                Add Cause
              </Button>
            </div>
            <CardDescription>What are the underlying causes of the central problem?</CardDescription>
          </CardHeader>
          <CardContent>
            {causes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Add at least 2 root causes of the central problem
              </p>
            ) : (
              <div className="space-y-3">
                {causes.map((cause, index) => (
                  <div key={cause.id} className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                    <Input
                      placeholder="e.g., Lack of trained teachers"
                      value={cause.text}
                      onChange={(e) => handleUpdateCause(cause.id, e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveCause(cause.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Complete Button */}
      <div className="flex justify-end">
        <Button onClick={handleComplete} disabled={!isComplete}>
          Mark Step as Complete
        </Button>
      </div>
    </div>
  )
}
