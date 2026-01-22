"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useDemoStore, type ProjectData } from "@/lib/demo-store"
import { Lightbulb, Sparkles } from "lucide-react"
import { MicButton } from "@/components/ui/mic-button"
import { GeographySelector } from "@/components/ui/geography-selector"
import { API_URL, type Project } from "@/lib/demo-store"
import { ExternalLink, ArrowDownToLine } from "lucide-react"

interface Props {
  projectId: string
  onNext?: () => void
}

const aiSuggestions = [
  "Be specific about the population affected and the geographic area.",
  "Quantify the problem with available data or estimates.",
  "Focus on the problem, not the solution.",
  "Ensure the problem is within your organization's scope to address.",
]

export function Step1ProblemDefinition({ projectId, onNext }: Props) {
  const { projects, updateProjectData, updateProgress } = useDemoStore()
  const project = projects.find((p) => p.id === projectId)

  const [formData, setFormData] = useState<NonNullable<ProjectData["problemDefinition"]>>({
    centralProblem: "",
    context: "",
    targetBeneficiaries: "",
    geographicScope: { state: "", district: "", block: "", cluster: "" },
    urgency: "medium",
  })

  const [similarProjects, setSimilarProjects] = useState<Project[]>([])

  useEffect(() => {
    if (project?.data.problemDefinition) {
      const serverData = project.data.problemDefinition

      // Handle legacy string data for geographicScope
      let safeGeographicScope = { state: "", district: "", block: "", cluster: "" }

      // If server data has geographicScope as string or null/undefined, use default
      if (serverData.geographicScope && typeof serverData.geographicScope === 'object') {
        safeGeographicScope = serverData.geographicScope as any
      }

      const safeData = {
        ...serverData,
        geographicScope: safeGeographicScope
      }

      if (JSON.stringify(safeData) !== JSON.stringify(formData)) {
        setFormData(safeData)
      }
    }
    // We intentionally omit formData from deps here to prevent infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.data.problemDefinition])

  // Debounced save
  useEffect(() => {
    const timer = setTimeout(() => {
      updateProjectData(projectId, "problemDefinition", formData)
    }, 1000)
    return () => clearTimeout(timer)
  }, [formData, projectId, updateProjectData])

  const handleChange = (field: keyof typeof formData, value: any) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
  }

  const handleGeographyChange = (value: typeof formData.geographicScope) => {
    setFormData({ ...formData, geographicScope: value })
  }

  useEffect(() => {
    const fetchSimilar = async () => {
      const { state, district } = formData.geographicScope
      if (!state) {
        setSimilarProjects([])
        return
      }

      try {
        const token = useDemoStore.getState().user?.token
        if (!token) return

        const query = new URLSearchParams()
        if (state) query.append("state", state)
        if (district) query.append("district", district)
        // Optional: include block/cluster if needed query.append("block", block)

        const res = await fetch(`${API_URL}/projects/location?${query.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (res.ok) {
          const projects = await res.json()
          // Filter out current project to show others
          setSimilarProjects(projects.filter((p: any) => p._id !== projectId && p.id !== projectId))
        }
      } catch (e) {
        console.error(e)
      }
    }

    // Debounce fetching
    const timer = setTimeout(fetchSimilar, 800)
    return () => clearTimeout(timer)
  }, [formData.geographicScope])

  const handleVoice = (field: keyof typeof formData, text: string) => {
    const current = formData[field] as string || ""
    const newValue = current ? `${current} ${text}` : text
    handleChange(field, newValue)
  }

  const handleComplete = () => {
    updateProgress(projectId, 1)
    if (onNext) onNext()
  }

  const isComplete =
    formData.centralProblem &&
    formData.context &&
    formData.targetBeneficiaries &&
    formData.geographicScope.state &&
    formData.geographicScope.district


  const handleImportProject = async (sourceId: string, sourceName: string) => {
    if (!confirm(`Are you sure you want to import data from "${sourceName}"?\n\nThis will overwrite your current problem definition and LFA content.`)) {
      return
    }

    try {
      const token = useDemoStore.getState().user?.token
      if (!token) return

      const res = await fetch(`${API_URL}/projects/${projectId}/import`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ sourceId })
      })

      if (res.ok) {
        const updatedProject = await res.json()
        const projectWithId = { ...updatedProject, id: updatedProject._id }

        // Update global store
        useDemoStore.getState().setCurrentProject(projectWithId)
        // Refresh local projects list
        useDemoStore.getState().fetchProjects()

        // Force refresh local form state
        if (updatedProject.data?.problemDefinition) {
          setFormData(updatedProject.data.problemDefinition)
        }

        alert("Project data imported successfully!")
      } else {
        const err = await res.json()
        alert(`Failed to import: ${err.message}`)
      }
    } catch (e) {
      console.error(e)
      alert("An error occurred while importing.")
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Tips */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Tips for Problem Definition
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2">
            {aiSuggestions.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Lightbulb className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Main Form */}
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Central Problem Statement</CardTitle>
            <CardDescription>
              What is the main problem your program aims to address? Write it as a negative condition affecting a
              specific population.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Textarea
                placeholder="e.g., Children aged 6-14 in rural Bihar have low foundational literacy skills, with only 30% able to read grade-level text."
                value={formData.centralProblem}
                onChange={(e) => handleChange("centralProblem", e.target.value)}
                rows={4}
                className="resize-none pr-10"
              />
              <div className="absolute right-2 top-2">
                <MicButton onTranscript={(text) => handleVoice("centralProblem", text)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Context & Background</CardTitle>
            <CardDescription>
              Provide relevant background information about the problem, including data, trends, and existing efforts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Textarea
                placeholder="Describe the historical context, relevant statistics, previous interventions, and why this problem persists..."
                value={formData.context}
                onChange={(e) => handleChange("context", e.target.value)}
                rows={5}
                className="resize-none pr-10"
              />
              <div className="absolute right-2 top-2">
                <MicButton onTranscript={(text) => handleVoice("context", text)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Target Beneficiaries</CardTitle>
              <CardDescription>Who are the primary people affected by this problem?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Textarea
                  placeholder="e.g., Out-of-school children aged 6-14, first-generation learners, girls from marginalized communities..."
                  value={formData.targetBeneficiaries}
                  onChange={(e) => handleChange("targetBeneficiaries", e.target.value)}
                  rows={3}
                  className="resize-none pr-10"
                />
                <div className="absolute right-2 top-2">
                  <MicButton onTranscript={(text) => handleVoice("targetBeneficiaries", text)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Geographic Scope</CardTitle>
              <CardDescription>Where will this program be implemented?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <GeographySelector
                value={formData.geographicScope}
                onChange={handleGeographyChange}
              />

              {similarProjects.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    Existing Projects in {formData.geographicScope.district || formData.geographicScope.state}
                  </h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {similarProjects.map((p: any) => (
                      <div
                        key={p.id || p._id}
                        className="text-sm p-3 bg-muted/50 hover:bg-muted rounded border flex items-center justify-between group transition-colors cursor-pointer"
                        onClick={() => handleImportProject(p.id || p._id, p.name)}
                        title="Click to use this plan as a template"
                      >
                        <div className="overflow-hidden">
                          <div className="font-medium truncate" title={p.name}>{p.name || "Untitled"}</div>
                          <div className="text-xs text-muted-foreground truncate" title={p.organization}>{p.organization}</div>
                          <div className="text-[10px] text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Click to Import Plan
                          </div>
                        </div>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground group-hover:text-primary">
                          <ArrowDownToLine className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2 mt-4">
                <Label>Problem Urgency</Label>
                <Select value={formData.urgency} onValueChange={(value) => handleChange("urgency", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Can be addressed gradually</SelectItem>
                    <SelectItem value="medium">Medium - Requires timely attention</SelectItem>
                    <SelectItem value="high">High - Needs immediate action</SelectItem>
                    <SelectItem value="critical">Critical - Emergency situation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div >
      </div >

      {/* Complete Step Button */}
      < div className="flex justify-end" >
        <Button onClick={handleComplete} disabled={!isComplete}>
          Mark Step as Complete
        </Button>
      </div >
    </div>

  )
}

