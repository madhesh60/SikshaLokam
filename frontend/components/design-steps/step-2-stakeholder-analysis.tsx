"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDemoStore, type ProjectData } from "@/lib/demo-store"
import { Plus, Trash2, Users, Sparkles } from "lucide-react"
import { MicButton } from "@/components/ui/mic-button"

interface Props {
  projectId: string
}

type Stakeholder = NonNullable<ProjectData["stakeholders"]>[number]

const defaultStakeholder: Omit<Stakeholder, "id"> = {
  name: "",
  type: "secondary",
  interest: "",
  influence: "medium",
  expectations: "",
}

const stakeholderTypes = [
  { value: "primary", label: "Primary Beneficiary", description: "Direct recipients of program benefits" },
  { value: "secondary", label: "Secondary Stakeholder", description: "Indirectly affected or supporting" },
  { value: "key", label: "Key Decision Maker", description: "Has authority over resources or policy" },
]

const influenceLevels = [
  { value: "high", label: "High", color: "bg-red-500/10 text-red-700" },
  { value: "medium", label: "Medium", color: "bg-yellow-500/10 text-yellow-700" },
  { value: "low", label: "Low", color: "bg-green-500/10 text-green-700" },
]

export function Step2StakeholderAnalysis({ projectId }: Props) {
  const { projects, updateProjectData, updateProgress } = useDemoStore()
  const project = projects.find((p) => p.id === projectId)

  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([])

  useEffect(() => {
    if (project?.data.stakeholders) {
      setStakeholders(project.data.stakeholders)
    }
  }, [project?.data.stakeholders])

  const handleAddStakeholder = () => {
    const newStakeholder: Stakeholder = {
      ...defaultStakeholder,
      id: crypto.randomUUID(),
    }
    const updated = [...stakeholders, newStakeholder]
    setStakeholders(updated)
    updateProjectData(projectId, "stakeholders", updated)
  }

  const handleUpdateStakeholder = (id: string, field: keyof Stakeholder, value: string) => {
    const updated = stakeholders.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    setStakeholders(updated)
    updateProjectData(projectId, "stakeholders", updated)
  }

  const handleRemoveStakeholder = (id: string) => {
    const updated = stakeholders.filter((s) => s.id !== id)
    setStakeholders(updated)
    updateProjectData(projectId, "stakeholders", updated)
  }

  const handleComplete = () => {
    updateProgress(projectId, 2)
  }

  const isComplete = stakeholders.length >= 3 && stakeholders.every((s) => s.name && s.interest)

  return (
    <div className="space-y-6">
      {/* Tips */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Stakeholder Analysis Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Identify all individuals, groups, and organizations who have an interest in or influence over your program.
            Include at least 3 stakeholders covering primary beneficiaries, partners, and decision-makers.
          </p>
        </CardContent>
      </Card>

      {/* Stakeholder List */}
      <div className="space-y-4">
        {stakeholders.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">No stakeholders yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Add your first stakeholder to begin the analysis</p>
              <Button onClick={handleAddStakeholder}>
                <Plus className="mr-2 h-4 w-4" />
                Add Stakeholder
              </Button>
            </CardContent>
          </Card>
        ) : (
          stakeholders.map((stakeholder, index) => (
            <Card key={stakeholder.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Stakeholder {index + 1}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveStakeholder(stakeholder.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Name / Group</Label>
                    <div className="relative">
                      <Input
                        placeholder="e.g., Primary School Teachers"
                        value={stakeholder.name}
                        onChange={(e) => handleUpdateStakeholder(stakeholder.id, "name", e.target.value)}
                        className="pr-10"
                      />
                      <div className="absolute right-2 top-1.5">
                        <MicButton onTranscript={(text) => handleUpdateStakeholder(stakeholder.id, "name", text)} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Stakeholder Type</Label>
                    <Select
                      value={stakeholder.type}
                      onValueChange={(value) =>
                        handleUpdateStakeholder(stakeholder.id, "type", value as Stakeholder["type"])
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {stakeholderTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div>
                              <div>{type.label}</div>
                              <div className="text-xs text-muted-foreground">{type.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Interest in the Program</Label>
                  <div className="relative">
                    <Textarea
                      placeholder="What is this stakeholder's interest or stake in the program?"
                      value={stakeholder.interest}
                      onChange={(e) => handleUpdateStakeholder(stakeholder.id, "interest", e.target.value)}
                      rows={2}
                      className="pr-10"
                    />
                    <div className="absolute right-2 top-2">
                      <MicButton onTranscript={(text) => handleUpdateStakeholder(stakeholder.id, "interest", text)} />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Level of Influence</Label>
                    <Select
                      value={stakeholder.influence}
                      onValueChange={(value) =>
                        handleUpdateStakeholder(stakeholder.id, "influence", value as Stakeholder["influence"])
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {influenceLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            <Badge className={level.color}>{level.label}</Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Expectations</Label>
                    <div className="relative">
                      <Input
                        placeholder="What do they expect from the program?"
                        value={stakeholder.expectations}
                        onChange={(e) => handleUpdateStakeholder(stakeholder.id, "expectations", e.target.value)}
                        className="pr-10"
                      />
                      <div className="absolute right-2 top-1.5">
                        <MicButton onTranscript={(text) => handleUpdateStakeholder(stakeholder.id, "expectations", text)} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        {stakeholders.length > 0 && (
          <Button variant="outline" onClick={handleAddStakeholder}>
            <Plus className="mr-2 h-4 w-4" />
            Add Another Stakeholder
          </Button>
        )}
        <div className="ml-auto">
          <Button onClick={handleComplete} disabled={!isComplete}>
            Mark Step as Complete
          </Button>
        </div>
      </div>
    </div>
  )
}

