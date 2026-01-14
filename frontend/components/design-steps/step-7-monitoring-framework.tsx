"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDemoStore, type ProjectData } from "@/lib/demo-store"
import { Plus, Trash2, BarChart3 } from "lucide-react"
import { MicButton } from "@/components/ui/mic-button"

interface Props {
  projectId: string
}

type Indicator = NonNullable<ProjectData["monitoring"]>["indicators"][number]
type MonitoringFramework = NonNullable<ProjectData["monitoring"]>

const indicatorTypes = [
  { value: "output", label: "Output Indicator" },
  { value: "outcome", label: "Outcome Indicator" },
  { value: "impact", label: "Impact Indicator" },
]

const frequencies = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "biannually", label: "Bi-annually" },
  { value: "annually", label: "Annually" },
]

export function Step7MonitoringFramework({ projectId }: Props) {
  const { projects, updateProjectData, updateProgress } = useDemoStore()
  const project = projects.find((p) => p.id === projectId)

  const [monitoring, setMonitoring] = useState<MonitoringFramework>({
    indicators: [],
    dataCollection: "",
    reportingSchedule: "",
  })

  useEffect(() => {
    if (project?.data.monitoring) {
      setMonitoring(project.data.monitoring)
    }
  }, [project?.data.monitoring])

  const saveData = (data: MonitoringFramework) => {
    updateProjectData(projectId, "monitoring", data)
  }

  const addIndicator = () => {
    const newIndicator: Indicator = {
      id: crypto.randomUUID(),
      name: "",
      type: "output",
      baseline: "",
      target: "",
      frequency: "quarterly",
      source: "",
      responsible: "",
    }
    const updated = { ...monitoring, indicators: [...monitoring.indicators, newIndicator] }
    setMonitoring(updated)
    saveData(updated)
  }

  const updateIndicator = (id: string, field: keyof Indicator, value: string) => {
    const updated = {
      ...monitoring,
      indicators: monitoring.indicators.map((ind) => (ind.id === id ? { ...ind, [field]: value } : ind)),
    }
    setMonitoring(updated)
    saveData(updated)
  }

  const removeIndicator = (id: string) => {
    const updated = {
      ...monitoring,
      indicators: monitoring.indicators.filter((ind) => ind.id !== id),
    }
    setMonitoring(updated)
    saveData(updated)
  }

  const updateField = (field: keyof Omit<MonitoringFramework, "indicators">, value: string) => {
    const updated = { ...monitoring, [field]: value }
    setMonitoring(updated)
    saveData(updated)
  }

  const handleComplete = () => {
    updateProgress(projectId, 7)
  }

  const isComplete = monitoring.indicators.length >= 1 && monitoring.dataCollection && monitoring.reportingSchedule

  return (
    <div className="space-y-6">
      {/* Tips */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            Monitoring & Evaluation Framework
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Design indicators to measure your program's progress and impact. Include baseline values, targets, data
            sources, and responsible parties for each indicator.
          </p>
        </CardContent>
      </Card>

      {/* Indicators */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Indicators</h3>
          <Button onClick={addIndicator}>
            <Plus className="mr-2 h-4 w-4" /> Add Indicator
          </Button>
        </div>

        {monitoring.indicators.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">No indicators yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Add indicators to track your program's progress</p>
              <Button onClick={addIndicator}>
                <Plus className="mr-2 h-4 w-4" /> Add First Indicator
              </Button>
            </CardContent>
          </Card>
        ) : (
          monitoring.indicators.map((indicator, index) => (
            <Card key={indicator.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">Indicator {index + 1}</CardTitle>
                    <Badge variant="outline">{indicatorTypes.find((t) => t.value === indicator.type)?.label}</Badge>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeIndicator(indicator.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Indicator Name</label>
                    <div className="relative">
                      <Input
                        placeholder="e.g., Number of teachers trained"
                        value={indicator.name}
                        onChange={(e) => updateIndicator(indicator.id, "name", e.target.value)}
                        className="pr-10"
                      />
                      <div className="absolute right-2 top-1.5">
                        <MicButton onTranscript={(text) => updateIndicator(indicator.id, "name", text)} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <Select
                      value={indicator.type}
                      onValueChange={(value) => updateIndicator(indicator.id, "type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {indicatorTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Baseline</label>
                    <div className="relative">
                      <Input
                        placeholder="e.g., 0"
                        value={indicator.baseline}
                        onChange={(e) => updateIndicator(indicator.id, "baseline", e.target.value)}
                        className="pr-10"
                      />
                      <div className="absolute right-2 top-1.5">
                        <MicButton onTranscript={(text) => updateIndicator(indicator.id, "baseline", text)} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target</label>
                    <div className="relative">
                      <Input
                        placeholder="e.g., 100"
                        value={indicator.target}
                        onChange={(e) => updateIndicator(indicator.id, "target", e.target.value)}
                        className="pr-10"
                      />
                      <div className="absolute right-2 top-1.5">
                        <MicButton onTranscript={(text) => updateIndicator(indicator.id, "target", text)} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Frequency</label>
                    <Select
                      value={indicator.frequency}
                      onValueChange={(value) => updateIndicator(indicator.id, "frequency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencies.map((freq) => (
                          <SelectItem key={freq.value} value={freq.value}>
                            {freq.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Responsible</label>
                    <div className="relative">
                      <Input
                        placeholder="Who collects data"
                        value={indicator.responsible}
                        onChange={(e) => updateIndicator(indicator.id, "responsible", e.target.value)}
                        className="pr-10"
                      />
                      <div className="absolute right-2 top-1.5">
                        <MicButton onTranscript={(text) => updateIndicator(indicator.id, "responsible", text)} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Source</label>
                  <div className="relative">
                    <Input
                      placeholder="e.g., Training attendance records, Post-training assessments"
                      value={indicator.source}
                      onChange={(e) => updateIndicator(indicator.id, "source", e.target.value)}
                      className="pr-10"
                    />
                    <div className="absolute right-2 top-1.5">
                      <MicButton onTranscript={(text) => updateIndicator(indicator.id, "source", text)} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Data Collection & Reporting */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Data Collection Methods</CardTitle>
            <CardDescription>How will you collect data for your indicators?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Textarea
                placeholder="Describe your data collection methods, tools, and processes..."
                value={monitoring.dataCollection}
                onChange={(e) => updateField("dataCollection", e.target.value)}
                rows={4}
                className="pr-10"
              />
              <div className="absolute right-2 top-2">
                <MicButton onTranscript={(text) => updateField("dataCollection", text)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Reporting Schedule</CardTitle>
            <CardDescription>When and how will you report on progress?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Textarea
                placeholder="Describe your reporting schedule, formats, and audiences..."
                value={monitoring.reportingSchedule}
                onChange={(e) => updateField("reportingSchedule", e.target.value)}
                rows={4}
                className="pr-10"
              />
              <div className="absolute right-2 top-2">
                <MicButton onTranscript={(text) => updateField("reportingSchedule", text)} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Complete Button */}
      <div className="flex justify-end">
        <Button onClick={handleComplete} disabled={!isComplete}>
          Complete Program Design
        </Button>
      </div>
    </div>
  )
}

