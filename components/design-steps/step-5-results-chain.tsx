"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDemoStore, type ProjectData } from "@/lib/demo-store"
import { Plus, Trash2, Sparkles, ArrowRight } from "lucide-react"

interface Props {
  projectId: string
}

type ResultsChain = NonNullable<ProjectData["resultsChain"]>

const chainSteps = [
  {
    key: "inputs" as const,
    title: "Inputs",
    description: "Resources required for the program",
    placeholder: "e.g., Funding, Staff, Materials, Training",
    color: "bg-slate-500/10 text-slate-700 border-slate-300",
  },
  {
    key: "activities" as const,
    title: "Activities",
    description: "Actions taken to produce outputs",
    placeholder: "e.g., Teacher training workshops, Curriculum development",
    color: "bg-blue-500/10 text-blue-700 border-blue-300",
  },
  {
    key: "outputs" as const,
    title: "Outputs",
    description: "Direct products of activities",
    placeholder: "e.g., 100 teachers trained, 50 classrooms equipped",
    color: "bg-green-500/10 text-green-700 border-green-300",
  },
  {
    key: "outcomes" as const,
    title: "Outcomes",
    description: "Short to medium-term changes",
    placeholder: "e.g., Improved teaching quality, Increased attendance",
    color: "bg-amber-500/10 text-amber-700 border-amber-300",
  },
]

export function Step5ResultsChain({ projectId }: Props) {
  const { projects, updateProjectData, updateProgress } = useDemoStore()
  const project = projects.find((p) => p.id === projectId)

  const [resultsChain, setResultsChain] = useState<ResultsChain>({
    inputs: [],
    activities: [],
    outputs: [],
    outcomes: [],
    impact: "",
  })

  useEffect(() => {
    if (project?.data.resultsChain) {
      setResultsChain(project.data.resultsChain)
    }
  }, [project?.data.resultsChain])

  const saveData = (data: ResultsChain) => {
    updateProjectData(projectId, "resultsChain", data)
  }

  const handleAddItem = (key: keyof Omit<ResultsChain, "impact">) => {
    const updated = { ...resultsChain, [key]: [...resultsChain[key], ""] }
    setResultsChain(updated)
    saveData(updated)
  }

  const handleUpdateItem = (key: keyof Omit<ResultsChain, "impact">, index: number, value: string) => {
    const updated = {
      ...resultsChain,
      [key]: resultsChain[key].map((item, i) => (i === index ? value : item)),
    }
    setResultsChain(updated)
    saveData(updated)
  }

  const handleRemoveItem = (key: keyof Omit<ResultsChain, "impact">, index: number) => {
    const updated = {
      ...resultsChain,
      [key]: resultsChain[key].filter((_, i) => i !== index),
    }
    setResultsChain(updated)
    saveData(updated)
  }

  const handleImpactChange = (value: string) => {
    const updated = { ...resultsChain, impact: value }
    setResultsChain(updated)
    saveData(updated)
  }

  const handleComplete = () => {
    updateProgress(projectId, 5)
  }

  const isComplete =
    resultsChain.inputs.length >= 1 &&
    resultsChain.activities.length >= 1 &&
    resultsChain.outputs.length >= 1 &&
    resultsChain.outcomes.length >= 1 &&
    resultsChain.impact

  return (
    <div className="space-y-6">
      {/* Tips */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Theory of Change (Results Chain)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The Results Chain shows the logical pathway from resources to impact. It demonstrates how your inputs lead
            to activities, which produce outputs, resulting in outcomes, and ultimately contributing to long-term
            impact.
          </p>
        </CardContent>
      </Card>

      {/* Results Chain Flow */}
      <div className="space-y-4">
        {chainSteps.map((step, stepIndex) => (
          <div key={step.key} className="flex items-start gap-4">
            <Card className={`flex-1 border-2 ${step.color}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={step.color}>
                      {stepIndex + 1}
                    </Badge>
                    <CardTitle className="text-base">{step.title}</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleAddItem(step.key)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="text-xs">{step.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {resultsChain[step.key].length === 0 ? (
                  <button
                    onClick={() => handleAddItem(step.key)}
                    className="w-full py-3 text-sm text-muted-foreground border border-dashed rounded-lg hover:bg-muted/50"
                  >
                    + Add {step.title.toLowerCase()}
                  </button>
                ) : (
                  <div className="space-y-2">
                    {resultsChain[step.key].map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder={step.placeholder}
                          value={item}
                          onChange={(e) => handleUpdateItem(step.key, index, e.target.value)}
                          className="flex-1 text-sm"
                        />
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(step.key, index)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {stepIndex < chainSteps.length - 1 && (
              <div className="flex items-center justify-center w-8 pt-16">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}

        {/* Impact */}
        <div className="flex items-start gap-4">
          <div className="w-8" />
          <Card className="flex-1 border-2 bg-primary/10 text-primary border-primary/30">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground">5</Badge>
                <CardTitle className="text-base">Long-term Impact</CardTitle>
              </div>
              <CardDescription className="text-xs">The ultimate change your program contributes to</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., All children in target areas achieve grade-appropriate literacy and numeracy skills, leading to improved life outcomes"
                value={resultsChain.impact}
                onChange={(e) => handleImpactChange(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </CardContent>
          </Card>
        </div>
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
