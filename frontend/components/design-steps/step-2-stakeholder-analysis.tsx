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
import { Plus, Trash2, Users, Sparkles, ArrowRight, LayoutDashboard } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MicButton } from "@/components/ui/mic-button"

interface Props {
  projectId: string
  onNext?: () => void
}

type Stakeholder = NonNullable<ProjectData["stakeholders"]>[number]






const defaultStakeholder: Omit<Stakeholder, "id"> = {
  name: "",
  type: "secondary",
  interest: "",
  influence: "medium",
  expectations: "",
  systemLevel: "village",
}

const stakeholderTypes = [
  { value: "primary", label: "Primary Beneficiary", description: "Direct recipients of program benefits" },
  { value: "secondary", label: "Secondary Stakeholder", description: "Indirectly affected or supporting" },
  { value: "key", label: "Key Decision Maker", description: "Has authority over resources or policy" },
]

const systemLevels = [
  { value: "village", label: "Village / Community", description: "Grassroots level (e.g., VAO, Parents)" },
  { value: "block", label: "Block Level", description: "Administrative block (e.g., BEO, BRC)" },
  { value: "district", label: "District Level", description: "District administration (e.g., DEO, DIET)" },
  { value: "state", label: "State Level", description: "State departments (e.g., SCERT, SPD)" },
  { value: "national", label: "National / Other", description: "National bodies or external partners" },
]

const commonRoles = {
  village: ["VAO", "School Management Committee", "Headmaster", "Parents", "Panchayat Leader"],
  block: ["Block Education Officer", "Block Resource Coordinator", "Cluster Resource Coordinator"],
  district: ["District Education Officer", "DIET Principal", "District Collector"],
  state: ["State Project Director", "SCERT Director", "Principal Secretary"],
}

const influenceLevels = [
  { value: "high", label: "High", color: "bg-red-500/10 text-red-700" },
  { value: "medium", label: "Medium", color: "bg-yellow-500/10 text-yellow-700" },
  { value: "low", label: "Low", color: "bg-green-500/10 text-green-700" },
]

export function Step2StakeholderAnalysis({ projectId, onNext }: Props) {
  const { projects, updateProjectData, updateProgress } = useDemoStore()
  const project = projects.find((p) => p.id === projectId)

  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([])
  const [activeTab, setActiveTab] = useState("identification")

  // Load initial data
  useEffect(() => {
    if (project?.data.stakeholders && stakeholders.length === 0) {
      setStakeholders(project.data.stakeholders)
    }
    // We only want to load initial data once per project load
    // so we rely on project.id changing to reset or similar logic if we were navigating
    // But since this component remounts on navigation (different route or key), just checking empty might be enough.
    // To be safer:
  }, [project?.id])

  // Sync if project changes completely (e.g. from one project to another without unmount?)
  useEffect(() => {
    if (project?.data.stakeholders) {
      // Only update if we have a fresh project load (length mismatch is a rough proxy for "not initialized" or "server has data we don't")
      // OR better, trust the user layout key to remount.
      // If we simply rely on the mount effect above, it's safer.
      // But let's support loading saved data if we navigated back to this step.
      if (stakeholders.length === 0 && project.data.stakeholders.length > 0) {
        setStakeholders(project.data.stakeholders)
      }
    }
  }, [project?.id, project?.data.stakeholders])

  // Debounced save
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only sync if stakeholders array isn't empty (or sync empty if deliberate)
      // We perform comparison to prevent unnecessary calls if possible, but the timer handles rapid updates.
      updateProjectData(projectId, "stakeholders", stakeholders)
    }, 1000)
    return () => clearTimeout(timer)
  }, [stakeholders, projectId, updateProjectData])

  const handleAddStakeholder = () => {
    const newStakeholder: Stakeholder = {
      ...defaultStakeholder,
      id: crypto.randomUUID(),
    }
    const updated = [...stakeholders, newStakeholder]
    setStakeholders(updated)
  }

  const handleUpdateStakeholder = (id: string, field: keyof Stakeholder, value: string) => {
    const updated = stakeholders.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    setStakeholders(updated)
  }

  const handleVoice = (id: string, field: keyof Stakeholder, text: string) => {
    const stakeholder = stakeholders.find(s => s.id === id)
    if (stakeholder) {
      const current = (stakeholder[field] as string) || ""
      const newValue = current ? `${current} ${text}` : text
      handleUpdateStakeholder(id, field, newValue)
    }
  }

  const handleRemoveStakeholder = (id: string) => {
    const updated = stakeholders.filter((s) => s.id !== id)
    setStakeholders(updated)
  }

  const handleComplete = () => {
    updateProgress(projectId, 2)
    if (onNext) onNext()
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
        {/* Quick Add Helper */}
        {stakeholders.length > 0 && activeTab === 'identification' && (
          <Card className="bg-muted/30 border-dashed">
            <CardHeader className="pb-3 px-4 pt-4">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <Users className="h-3 w-3" />
                Quick Add Common Roles
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex flex-wrap gap-2">
                {Object.entries(commonRoles).map(([level, roles]) => (
                  roles.map(role => (
                    <Badge
                      key={`${level}-${role}`}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={() => {
                        const newStakeholder: Stakeholder = {
                          ...defaultStakeholder,
                          id: crypto.randomUUID(),
                          name: role,
                          systemLevel: level,
                        }
                        setStakeholders([...stakeholders, newStakeholder])
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {role}
                    </Badge>
                  ))
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="identification">1. Stakeholder Identification</TabsTrigger>
              <TabsTrigger value="mapping">2. Practice & Outcome Mapping</TabsTrigger>
            </TabsList>

            <TabsContent value="identification" className="space-y-4">
              {stakeholders.map((stakeholder, index) => (
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
                            <MicButton onTranscript={(text) => handleVoice(stakeholder.id, "name", text)} />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>System Level</Label>
                        <Select
                          value={stakeholder.systemLevel || "village"}
                          onValueChange={(value) =>
                            handleUpdateStakeholder(stakeholder.id, "systemLevel", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {systemLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                <div>
                                  <div>{level.label}</div>
                                  <div className="text-xs text-muted-foreground">{level.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                          <MicButton onTranscript={(text) => handleVoice(stakeholder.id, "interest", text)} />
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
                            <MicButton onTranscript={(text) => handleVoice(stakeholder.id, "expectations", text)} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="mapping" className="space-y-4">
              <div className="bg-primary/5 p-4 rounded-lg flex items-center gap-2 text-sm text-primary mb-4">
                <LayoutDashboard className="h-4 w-4" />
                Map the behavior changes required from each stakeholder to achieve your program outcomes.
              </div>
              {stakeholders.map((stakeholder, index) => (
                <Card key={stakeholder.id}>
                  <CardHeader className="pb-3 bg-muted/30">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      {stakeholder.name || `Stakeholder ${index + 1}`}
                      <div className="flex gap-2 ml-auto">
                        <Badge variant="secondary" className="font-normal text-xs">
                          {systemLevels.find((l) => l.value === (stakeholder.systemLevel || "village"))?.label}
                        </Badge>
                        <Badge variant="outline" className="font-normal">
                          {stakeholderTypes.find((t) => t.value === stakeholder.type)?.label}
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-6">
                    <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr]">
                      {/* Current Practice */}
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Current Practice / Behavior
                        </Label>
                        <div className="relative">
                          <Textarea
                            placeholder="What are they doing now?"
                            value={stakeholder.currentPractice || ""}
                            onChange={(e) => handleUpdateStakeholder(stakeholder.id, "currentPractice", e.target.value)}
                            className="bg-red-50/50 border-red-100 focus-visible:ring-red-200 min-h-[80px]"
                          />
                          <div className="absolute right-2 top-2">
                            <MicButton onTranscript={(text) => handleVoice(stakeholder.id, "currentPractice", text)} />
                          </div>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex items-center justify-center pt-6">
                        <ArrowRight className="h-6 w-6 text-muted-foreground" />
                      </div>

                      {/* Expected Practice */}
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Expected Practice Change
                        </Label>
                        <div className="relative">
                          <Textarea
                            placeholder="What should they do differently?"
                            value={stakeholder.expectedPractice || ""}
                            onChange={(e) => handleUpdateStakeholder(stakeholder.id, "expectedPractice", e.target.value)}
                            className="bg-green-50/50 border-green-100 focus-visible:ring-green-200 min-h-[80px]"
                          />
                          <div className="absolute right-2 top-2">
                            <MicButton onTranscript={(text) => handleVoice(stakeholder.id, "expectedPractice", text)} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Linked Outcome */}
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        Linked Outcome <span className="text-muted-foreground/60 font-normal">(Why does this change matter?)</span>
                      </Label>
                      <div className="relative">
                        <Input
                          placeholder="e.g., Leads to improved student literacy"
                          value={stakeholder.linkedOutcome || ""}
                          onChange={(e) => handleUpdateStakeholder(stakeholder.id, "linkedOutcome", e.target.value)}
                          className="pr-10"
                        />
                        <div className="absolute right-2 top-1.5">
                          <MicButton onTranscript={(text) => handleVoice(stakeholder.id, "linkedOutcome", text)} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
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
    </div >
  )
}

