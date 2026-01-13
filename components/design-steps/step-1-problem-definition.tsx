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

interface Props {
  projectId: string
}

const aiSuggestions = [
  "Be specific about the population affected and the geographic area.",
  "Quantify the problem with available data or estimates.",
  "Focus on the problem, not the solution.",
  "Ensure the problem is within your organization's scope to address.",
]

export function Step1ProblemDefinition({ projectId }: Props) {
  const { projects, updateProjectData, updateProgress } = useDemoStore()
  const project = projects.find((p) => p.id === projectId)

  const [formData, setFormData] = useState<NonNullable<ProjectData["problemDefinition"]>>({
    centralProblem: "",
    context: "",
    targetBeneficiaries: "",
    geographicScope: "",
    urgency: "medium",
  })

  useEffect(() => {
    if (project?.data.problemDefinition) {
      setFormData(project.data.problemDefinition)
    }
  }, [project?.data.problemDefinition])

  const handleChange = (field: keyof typeof formData, value: string) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    updateProjectData(projectId, "problemDefinition", updated)
  }

  const handleComplete = () => {
    updateProgress(projectId, 1)
  }

  const isComplete =
    formData.centralProblem && formData.context && formData.targetBeneficiaries && formData.geographicScope

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
            <Textarea
              placeholder="e.g., Children aged 6-14 in rural Bihar have low foundational literacy skills, with only 30% able to read grade-level text."
              value={formData.centralProblem}
              onChange={(e) => handleChange("centralProblem", e.target.value)}
              rows={4}
              className="resize-none"
            />
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
            <Textarea
              placeholder="Describe the historical context, relevant statistics, previous interventions, and why this problem persists..."
              value={formData.context}
              onChange={(e) => handleChange("context", e.target.value)}
              rows={5}
              className="resize-none"
            />
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Target Beneficiaries</CardTitle>
              <CardDescription>Who are the primary people affected by this problem?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., Out-of-school children aged 6-14, first-generation learners, girls from marginalized communities..."
                value={formData.targetBeneficiaries}
                onChange={(e) => handleChange("targetBeneficiaries", e.target.value)}
                rows={3}
                className="resize-none"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Geographic Scope</CardTitle>
              <CardDescription>Where will this program be implemented?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="e.g., 5 blocks in Muzaffarpur district, Bihar"
                value={formData.geographicScope}
                onChange={(e) => handleChange("geographicScope", e.target.value)}
              />
              <div className="space-y-2">
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
        </div>
      </div>

      {/* Complete Step Button */}
      <div className="flex justify-end">
        <Button onClick={handleComplete} disabled={!isComplete}>
          Mark Step as Complete
        </Button>
      </div>
    </div>
  )
}
