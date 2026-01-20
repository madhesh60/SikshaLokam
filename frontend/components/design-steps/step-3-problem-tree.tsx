"use client"

import { useState, useEffect , useRef} from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDemoStore } from "@/lib/demo-store"
import { Plus, Trash2, ArrowUp, ArrowDown, Sparkles, GitBranch } from "lucide-react"
import { MicButton } from "@/components/ui/mic-button"

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

  // Track last saved state to prevent echoes and unnecessary writes
  const lastSavedRef = useState(JSON.stringify({ centralProblem: "", causes: [], effects: [] }))[0]
  // Ideally use useRef, but for cleaner code in this functional component without large refactors:
  const lastSaved = useRef("")

  useEffect(() => {
    if (project?.data.problemTree) {
      const { centralProblem: cp, causes: c, effects: e } = project.data.problemTree
      // Only update local state if it's significantly different (e.g., initial load or external update)
      // This logic helps but the main fix is the debounce below
      
      // Simple check to avoid overwriting user typing if backend is slow? 
      // For now, we trust the "Init once" pattern or we accept last-write-wins for simplicity in this demo.
      // We'll just set state if we haven't touched it yet or on first load.
      
      // Actually, standard pattern: Sync from props/store on mount or invalidation
      const newState = JSON.stringify({ centralProblem: cp, causes: c, effects: e })
      if (newState !== lastSaved.current && lastSaved.current === "") {
        setCentralProblem(cp || "")
        setCauses(c || [])
        setEffects(e || [])
        lastSaved.current = newState
      }
    } else if (project?.data.problemDefinition?.centralProblem && lastSaved.current === "") {
       // Fallback to problem definition if tree is empty
       setCentralProblem(project.data.problemDefinition.centralProblem)
    }
  }, [project?.data.problemTree, project?.data.problemDefinition])

  // Debounced Save Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentData = { centralProblem, causes, effects }
      const stringified = JSON.stringify(currentData)

      // Save if data has changed from what we last believe we saved/loaded
      if (stringified !== lastSaved.current) {
        // Prevent saving empty initial state over existing data if things haven't initialized
        if (centralProblem === "" && causes.length === 0 && effects.length === 0 && lastSaved.current !== "") {
           return 
        }

        updateProjectData(projectId, "problemTree", currentData)
        lastSaved.current = stringified
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [centralProblem, causes, effects, projectId, updateProjectData])

  // Handlers now only update local state
  const handleAddCause = () => {
    const newCause: TreeItem = { id: crypto.randomUUID(), text: "" }
    setCauses([...causes, newCause])
  }

  const handleAddEffect = () => {
    const newEffect: TreeItem = { id: crypto.randomUUID(), text: "" }
    setEffects([...effects, newEffect])
  }

  const handleUpdateCause = (id: string, text: string) => {
    setCauses(causes.map((c) => (c.id === id ? { ...c, text } : c)))
  }

  const handleUpdateEffect = (id: string, text: string) => {
    setEffects(effects.map((e) => (e.id === id ? { ...e, text } : e)))
  }

  const handleRemoveCause = (id: string) => {
    setCauses(causes.filter((c) => c.id !== id))
  }

  const handleRemoveEffect = (id: string) => {
    setEffects(effects.filter((e) => e.id !== id))
  }

  const handleCentralProblemChange = (value: string) => {
    setCentralProblem(value)
  }

  const handleComplete = () => {
    updateProgress(projectId, 3)
  }

  const isComplete = centralProblem && causes.length >= 2 && effects.length >= 2

  return (
    <div className="space-y-4">
      {/* Tips */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="h-3 w-3 text-primary" />
            Problem Tree Guidance
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3 px-4 text-xs text-muted-foreground">
          The Problem Tree visualizes cause-effect relationships. Place the central problem in the middle, root causes below, and effects above.
        </CardContent>
      </Card>

      {/* Tree Visualization */}
      <div className="space-y-4">
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
                    <MicButton onTranscript={(text) => handleUpdateEffect(effect.id, text)} />
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
            <div className="relative">
              <Input
                value={centralProblem}
                onChange={(e) => handleCentralProblemChange(e.target.value)}
                className="text-center font-medium pr-10"
                placeholder="The main problem your program addresses"
              />
              <div className="absolute right-2 top-1.5">
                <MicButton onTranscript={(text) => handleCentralProblemChange(text)} />
              </div>
            </div>
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
                    <MicButton onTranscript={(text) => handleUpdateCause(cause.id, text)} />
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

