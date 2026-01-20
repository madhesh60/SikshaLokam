"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDemoStore } from "@/lib/demo-store"
import { Plus, Trash2, ArrowUp, ArrowDown, Sparkles, GitMerge, RefreshCw } from "lucide-react"
import { MicButton } from "@/components/ui/mic-button"

interface Props {
  projectId: string
}

type TreeItem = { id: string; text: string; parentId?: string }

export function Step4ObjectiveTree({ projectId }: Props) {
  const { projects, updateProjectData, updateProgress } = useDemoStore()
  const project = projects.find((p) => p.id === projectId)

  const [centralObjective, setCentralObjective] = useState("")
  const [means, setMeans] = useState<TreeItem[]>([])
  const [ends, setEnds] = useState<TreeItem[]>([])

  useEffect(() => {
    if (project?.data.objectiveTree) {
      const { centralObjective: co, means: m, ends: e } = project.data.objectiveTree
      const currentState = { centralObjective, means, ends }
      const serverState = { centralObjective: co || "", means: m || [], ends: e || [] }

      if (JSON.stringify(currentState) !== JSON.stringify(serverState)) {
        setCentralObjective(serverState.centralObjective)
        setMeans(serverState.means)
        setEnds(serverState.ends)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.data.objectiveTree])

  // Debounced Save
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentData = { centralObjective, means, ends }
      if (!centralObjective && means.length === 0 && ends.length === 0) {
        // empty
      }
      updateProjectData(projectId, "objectiveTree", currentData)
    }, 1000)
    return () => clearTimeout(timer)
  }, [centralObjective, means, ends, projectId, updateProjectData])

  // Transform problem tree to objective tree
  const handleTransformFromProblemTree = () => {
    const problemTree = project?.data.problemTree
    if (!problemTree) return

    // Convert negative statements to positive
    const transformText = (text: string) => {
      const negativeWords = ["lack of", "low", "poor", "inadequate", "insufficient", "limited", "weak", "no", "not"]
      let transformed = text

      negativeWords.forEach((word) => {
        const regex = new RegExp(word, "gi")
        if (word === "lack of") transformed = transformed.replace(regex, "adequate")
        else if (word === "low") transformed = transformed.replace(regex, "improved")
        else if (word === "poor") transformed = transformed.replace(regex, "quality")
        else if (word === "inadequate") transformed = transformed.replace(regex, "adequate")
        else if (word === "insufficient") transformed = transformed.replace(regex, "sufficient")
        else if (word === "limited") transformed = transformed.replace(regex, "expanded")
        else if (word === "weak") transformed = transformed.replace(regex, "strengthened")
        else if (word === "no" || word === "not") transformed = transformed.replace(regex, "")
      })

      return transformed.trim()
    }

    const newCentralObjective = transformText(problemTree.centralProblem)
    const newMeans = problemTree.causes.map((cause) => ({
      id: crypto.randomUUID(),
      text: transformText(cause.text),
    }))
    const newEnds = problemTree.effects.map((effect) => ({
      id: crypto.randomUUID(),
      text: transformText(effect.text),
    }))

    setCentralObjective(newCentralObjective)
    setMeans(newMeans)
    setEnds(newEnds)
    // Removed direct saveData, useEffect will pick it up
  }

  const handleAddMeans = () => {
    const newMeans: TreeItem = { id: crypto.randomUUID(), text: "" }
    const updated = [...means, newMeans]
    setMeans(updated)
  }

  const handleAddEnds = () => {
    const newEnd: TreeItem = { id: crypto.randomUUID(), text: "" }
    const updated = [...ends, newEnd]
    setEnds(updated)
  }

  const handleUpdateMeans = (id: string, text: string) => {
    const updated = means.map((m) => (m.id === id ? { ...m, text } : m))
    setMeans(updated)
  }

  const handleUpdateEnds = (id: string, text: string) => {
    const updated = ends.map((e) => (e.id === id ? { ...e, text } : e))
    setEnds(updated)
  }

  const handleRemoveMeans = (id: string) => {
    const updated = means.filter((m) => m.id !== id)
    setMeans(updated)
  }

  const handleRemoveEnds = (id: string) => {
    const updated = ends.filter((e) => e.id !== id)
    setEnds(updated)
  }

  const handleCentralObjectiveChange = (value: string) => {
    setCentralObjective(value)
  }

  const handleVoice = (type: "central" | "means" | "ends", id: string | null, text: string) => {
    if (type === "central") {
      const current = centralObjective
      setCentralObjective(current ? `${current} ${text}` : text)
    } else if (type === "means" && id) {
      const item = means.find(m => m.id === id)
      if (item) {
        const current = item.text
        handleUpdateMeans(id, current ? `${current} ${text}` : text)
      }
    } else if (type === "ends" && id) {
      const item = ends.find(e => e.id === id)
      if (item) {
        const current = item.text
        handleUpdateEnds(id, current ? `${current} ${text}` : text)
      }
    }
  }

  const handleComplete = () => {
    updateProgress(projectId, 4)
  }

  const isComplete = centralObjective && means.length >= 2 && ends.length >= 2
  const hasProblemTree = project?.data.problemTree?.centralProblem

  return (
    <div className="space-y-6">
      {/* Tips */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Objective Tree Guidance
            </CardTitle>
            {hasProblemTree && (
              <Button variant="outline" size="sm" onClick={handleTransformFromProblemTree}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Auto-generate from Problem Tree
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Transform your Problem Tree into an Objective Tree by converting negative statements into positive desired
            conditions. Causes become "means" (how to achieve), and effects become "ends" (what you want to achieve).
          </p>
        </CardContent>
      </Card>

      {/* Tree Visualization */}
      <div className="space-y-6">
        {/* Ends (Top) */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowUp className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Ends (Desired Outcomes)</CardTitle>
                <Badge variant="outline">{ends.length}</Badge>
              </div>
              <Button variant="outline" size="sm" onClick={handleAddEnds}>
                <Plus className="mr-2 h-4 w-4" />
                Add End
              </Button>
            </div>
            <CardDescription>What positive outcomes will result from achieving the objective?</CardDescription>
          </CardHeader>
          <CardContent>
            {ends.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Add at least 2 desired outcomes</p>
            ) : (
              <div className="space-y-3">
                {ends.map((end, index) => (
                  <div key={end.id} className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                    <Input
                      placeholder="e.g., Improved school retention rates"
                      value={end.text}
                      onChange={(e) => handleUpdateEnds(end.id, e.target.value)}
                      className="flex-1"
                    />
                    <MicButton onTranscript={(text) => handleVoice("ends", end.id, text)} />
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveEnds(end.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Central Objective */}
        <Card className="border-2 border-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <GitMerge className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Central Objective</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Input
                value={centralObjective}
                onChange={(e) => handleCentralObjectiveChange(e.target.value)}
                className="text-center font-medium pr-10"
                placeholder="The main objective your program will achieve"
              />
              <div className="absolute right-2 top-1.5">
                <MicButton onTranscript={(text) => handleVoice("central", null, text)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Means (Bottom) */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowDown className="h-5 w-5 text-accent" />
                <CardTitle className="text-lg">Means (Strategies)</CardTitle>
                <Badge variant="outline">{means.length}</Badge>
              </div>
              <Button variant="outline" size="sm" onClick={handleAddMeans}>
                <Plus className="mr-2 h-4 w-4" />
                Add Means
              </Button>
            </div>
            <CardDescription>What strategies or actions will help achieve the objective?</CardDescription>
          </CardHeader>
          <CardContent>
            {means.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Add at least 2 strategies or means</p>
            ) : (
              <div className="space-y-3">
                {means.map((m, index) => (
                  <div key={m.id} className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                    <Input
                      placeholder="e.g., Provide trained teachers"
                      value={m.text}
                      onChange={(e) => handleUpdateMeans(m.id, e.target.value)}
                      className="flex-1"
                    />
                    <MicButton onTranscript={(text) => handleVoice("means", m.id, text)} />
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveMeans(m.id)}>
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

