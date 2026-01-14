"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDemoStore, type ProjectData } from "@/lib/demo-store"
import { Plus, Trash2, Table, RefreshCw } from "lucide-react"
import { MicButton } from "@/components/ui/mic-button"

interface Props {
  projectId: string
}

type Logframe = NonNullable<ProjectData["logframe"]>
type LogframeRow = { narrative: string; indicators: string[]; mov: string[]; assumptions: string[] }

const defaultRow: LogframeRow = {
  narrative: "",
  indicators: [""],
  mov: [""],
  assumptions: [""],
}

export function Step6LogicalFramework({ projectId }: Props) {
  const { projects, updateProjectData, updateProgress } = useDemoStore()
  const project = projects.find((p) => p.id === projectId)

  const [logframe, setLogframe] = useState<Logframe>({
    goal: { ...defaultRow },
    purpose: { ...defaultRow },
    outputs: [{ ...defaultRow }],
    activities: [{ narrative: "", inputs: [""], timeline: "", responsible: "" }],
  })

  const [activeTab, setActiveTab] = useState("goal")

  useEffect(() => {
    if (project?.data.logframe) {
      setLogframe(project.data.logframe)
    }
  }, [project?.data.logframe])

  const saveData = (data: Logframe) => {
    updateProjectData(projectId, "logframe", data)
  }

  // Auto-populate from previous steps
  const handleAutoPopulate = () => {
    const { resultsChain, objectiveTree } = project?.data || {}

    const newLogframe: Logframe = {
      goal: {
        narrative: resultsChain?.impact || "",
        indicators: [""],
        mov: [""],
        assumptions: [""],
      },
      purpose: {
        narrative: objectiveTree?.centralObjective || "",
        indicators: [""],
        mov: [""],
        assumptions: [""],
      },
      outputs: resultsChain?.outputs?.map((output) => ({
        narrative: output,
        indicators: [""],
        mov: [""],
        assumptions: [""],
      })) || [{ ...defaultRow }],
      activities: resultsChain?.activities?.map((activity) => ({
        narrative: activity,
        inputs: [""],
        timeline: "",
        responsible: "",
      })) || [{ narrative: "", inputs: [""], timeline: "", responsible: "" }],
    }

    setLogframe(newLogframe)
    saveData(newLogframe)
  }

  const updateRowField = (level: "goal" | "purpose", field: keyof LogframeRow, value: string | string[]) => {
    const updated = {
      ...logframe,
      [level]: { ...logframe[level], [field]: value },
    }
    setLogframe(updated)
    saveData(updated)
  }

  const updateOutputField = (index: number, field: keyof LogframeRow, value: string | string[]) => {
    const updated = {
      ...logframe,
      outputs: logframe.outputs.map((o, i) => (i === index ? { ...o, [field]: value } : o)),
    }
    setLogframe(updated)
    saveData(updated)
  }

  const addOutput = () => {
    const updated = {
      ...logframe,
      outputs: [...logframe.outputs, { ...defaultRow }],
    }
    setLogframe(updated)
    saveData(updated)
  }

  const removeOutput = (index: number) => {
    if (logframe.outputs.length > 1) {
      const updated = {
        ...logframe,
        outputs: logframe.outputs.filter((_, i) => i !== index),
      }
      setLogframe(updated)
      saveData(updated)
    }
  }

  const updateActivityField = (
    index: number,
    field: keyof Logframe["activities"][number],
    value: string | string[],
  ) => {
    const updated = {
      ...logframe,
      activities: logframe.activities.map((a, i) => (i === index ? { ...a, [field]: value } : a)),
    }
    setLogframe(updated)
    saveData(updated)
  }

  const addActivity = () => {
    const updated = {
      ...logframe,
      activities: [...logframe.activities, { narrative: "", inputs: [""], timeline: "", responsible: "" }],
    }
    setLogframe(updated)
    saveData(updated)
  }

  const removeActivity = (index: number) => {
    if (logframe.activities.length > 1) {
      const updated = {
        ...logframe,
        activities: logframe.activities.filter((_, i) => i !== index),
      }
      setLogframe(updated)
      saveData(updated)
    }
  }

  const handleComplete = () => {
    updateProgress(projectId, 6)
  }

  const isComplete = logframe.goal.narrative && logframe.purpose.narrative && logframe.outputs.length > 0

  const renderRow = (title: string, level: "goal" | "purpose", description: string) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Narrative Summary</label>
          <div className="relative">
            <Textarea
              placeholder={`Describe the ${title.toLowerCase()}...`}
              value={logframe[level].narrative}
              onChange={(e) => updateRowField(level, "narrative", e.target.value)}
              rows={2}
              className="pr-10"
            />
            <div className="absolute right-2 top-2">
              <MicButton onTranscript={(text) => updateRowField(level, "narrative", text)} />
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Indicators</label>
            {logframe[level].indicators.map((ind, i) => (
              <div key={i} className="relative">
                <Input
                  placeholder="Measurable indicator"
                  value={ind}
                  onChange={(e) => {
                    const newInds = [...logframe[level].indicators]
                    newInds[i] = e.target.value
                    updateRowField(level, "indicators", newInds)
                  }}
                  className="pr-10"
                />
                <div className="absolute right-2 top-1.5">
                  <MicButton onTranscript={(text) => {
                    const newInds = [...logframe[level].indicators]
                    newInds[i] = text
                    updateRowField(level, "indicators", newInds)
                  }} />
                </div>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateRowField(level, "indicators", [...logframe[level].indicators, ""])}
            >
              <Plus className="h-3 w-3 mr-1" /> Add
            </Button>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Means of Verification</label>
            {logframe[level].mov.map((m, i) => (
              <div key={i} className="relative">
                <Input
                  placeholder="Data source"
                  value={m}
                  onChange={(e) => {
                    const newMov = [...logframe[level].mov]
                    newMov[i] = e.target.value
                    updateRowField(level, "mov", newMov)
                  }}
                  className="pr-10"
                />
                <div className="absolute right-2 top-1.5">
                  <MicButton onTranscript={(text) => {
                    const newMov = [...logframe[level].mov]
                    newMov[i] = text
                    updateRowField(level, "mov", newMov)
                  }} />
                </div>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateRowField(level, "mov", [...logframe[level].mov, ""])}
            >
              <Plus className="h-3 w-3 mr-1" /> Add
            </Button>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Assumptions</label>
            {logframe[level].assumptions.map((a, i) => (
              <div key={i} className="relative">
                <Input
                  placeholder="Key assumption"
                  value={a}
                  onChange={(e) => {
                    const newAssump = [...logframe[level].assumptions]
                    newAssump[i] = e.target.value
                    updateRowField(level, "assumptions", newAssump)
                  }}
                  className="pr-10"
                />
                <div className="absolute right-2 top-1.5">
                  <MicButton onTranscript={(text) => {
                    const newAssump = [...logframe[level].assumptions]
                    newAssump[i] = text
                    updateRowField(level, "assumptions", newAssump)
                  }} />
                </div>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateRowField(level, "assumptions", [...logframe[level].assumptions, ""])}
            >
              <Plus className="h-3 w-3 mr-1" /> Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Tips */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Table className="h-4 w-4 text-primary" />
              Logical Framework Matrix
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleAutoPopulate}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Auto-populate from Results Chain
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The Logframe Matrix summarizes your program design in a structured format. It includes the hierarchy of
            objectives, indicators, means of verification, and assumptions.
          </p>
        </CardContent>
      </Card>

      {/* Tabs for different levels */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="goal">Goal</TabsTrigger>
          <TabsTrigger value="purpose">Purpose</TabsTrigger>
          <TabsTrigger value="outputs">
            Outputs{" "}
            <Badge variant="secondary" className="ml-1">
              {logframe.outputs.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="activities">
            Activities{" "}
            <Badge variant="secondary" className="ml-1">
              {logframe.activities.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="goal" className="mt-4">
          {renderRow("Goal (Impact)", "goal", "The long-term, broad development impact the project contributes to")}
        </TabsContent>

        <TabsContent value="purpose" className="mt-4">
          {renderRow("Purpose (Outcome)", "purpose", "The direct effect of the project on the target group")}
        </TabsContent>

        <TabsContent value="outputs" className="mt-4 space-y-4">
          {logframe.outputs.map((output, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Output {index + 1}</CardTitle>
                  {logframe.outputs.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => removeOutput(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Narrative Summary</label>
                  <div className="relative">
                    <Textarea
                      placeholder="Describe this output..."
                      value={output.narrative}
                      onChange={(e) => updateOutputField(index, "narrative", e.target.value)}
                      rows={2}
                      className="pr-10"
                    />
                    <div className="absolute right-2 top-2">
                      <MicButton onTranscript={(text) => updateOutputField(index, "narrative", text)} />
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Indicators</label>
                    {output.indicators.map((ind, i) => (
                      <div key={i} className="relative">
                        <Input
                          placeholder="Measurable indicator"
                          value={ind}
                          onChange={(e) => {
                            const newInds = [...output.indicators]
                            newInds[i] = e.target.value
                            updateOutputField(index, "indicators", newInds)
                          }}
                          className="pr-10"
                        />
                        <div className="absolute right-2 top-1.5">
                          <MicButton onTranscript={(text) => {
                            const newInds = [...output.indicators]
                            newInds[i] = text
                            updateOutputField(index, "indicators", newInds)
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Means of Verification</label>
                    {output.mov.map((m, i) => (
                      <div key={i} className="relative">
                        <Input
                          placeholder="Data source"
                          value={m}
                          onChange={(e) => {
                            const newMov = [...output.mov]
                            newMov[i] = e.target.value
                            updateOutputField(index, "mov", newMov)
                          }}
                          className="pr-10"
                        />
                        <div className="absolute right-2 top-1.5">
                          <MicButton onTranscript={(text) => {
                            const newMov = [...output.mov]
                            newMov[i] = text
                            updateOutputField(index, "mov", newMov)
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Assumptions</label>
                    {output.assumptions.map((a, i) => (
                      <div key={i} className="relative">
                        <Input
                          placeholder="Key assumption"
                          value={a}
                          onChange={(e) => {
                            const newAssump = [...output.assumptions]
                            newAssump[i] = e.target.value
                            updateOutputField(index, "assumptions", newAssump)
                          }}
                          className="pr-10"
                        />
                        <div className="absolute right-2 top-1.5">
                          <MicButton onTranscript={(text) => {
                            const newAssump = [...output.assumptions]
                            newAssump[i] = text
                            updateOutputField(index, "assumptions", newAssump)
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" onClick={addOutput}>
            <Plus className="mr-2 h-4 w-4" /> Add Output
          </Button>
        </TabsContent>

        <TabsContent value="activities" className="mt-4 space-y-4">
          {logframe.activities.map((activity, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Activity {index + 1}</CardTitle>
                  {logframe.activities.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => removeActivity(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Activity Description</label>
                  <div className="relative">
                    <Textarea
                      placeholder="Describe this activity..."
                      value={activity.narrative}
                      onChange={(e) => updateActivityField(index, "narrative", e.target.value)}
                      rows={2}
                      className="pr-10"
                    />
                    <div className="absolute right-2 top-2">
                      <MicButton onTranscript={(text) => updateActivityField(index, "narrative", text)} />
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Inputs Required</label>
                    {activity.inputs.map((inp, i) => (
                      <div key={i} className="relative">
                        <Input
                          placeholder="Resource needed"
                          value={inp}
                          onChange={(e) => {
                            const newInputs = [...activity.inputs]
                            newInputs[i] = e.target.value
                            updateActivityField(index, "inputs", newInputs)
                          }}
                          className="pr-10"
                        />
                        <div className="absolute right-2 top-1.5">
                          <MicButton onTranscript={(text) => {
                            const newInputs = [...activity.inputs]
                            newInputs[i] = text
                            updateActivityField(index, "inputs", newInputs)
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Timeline</label>
                    <div className="relative">
                      <Input
                        placeholder="e.g., Q1-Q2 2026"
                        value={activity.timeline}
                        onChange={(e) => updateActivityField(index, "timeline", e.target.value)}
                        className="pr-10"
                      />
                      <div className="absolute right-2 top-1.5">
                        <MicButton onTranscript={(text) => updateActivityField(index, "timeline", text)} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Responsible</label>
                    <div className="relative">
                      <Input
                        placeholder="Who is responsible"
                        value={activity.responsible}
                        onChange={(e) => updateActivityField(index, "responsible", e.target.value)}
                        className="pr-10"
                      />
                      <div className="absolute right-2 top-1.5">
                        <MicButton onTranscript={(text) => updateActivityField(index, "responsible", text)} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" onClick={addActivity}>
            <Plus className="mr-2 h-4 w-4" /> Add Activity
          </Button>
        </TabsContent>
      </Tabs>

      {/* Complete Button */}
      <div className="flex justify-end">
        <Button onClick={handleComplete} disabled={!isComplete}>
          Mark Step as Complete
        </Button>
      </div>
    </div>
  )
}

