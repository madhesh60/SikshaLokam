"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDemoStore, type ProjectData } from "@/lib/demo-store"
import { Plus, Trash2, Table, RefreshCw, BookOpen } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

const COMMON_LFA_DATA = [
  {
    theme: "Foundational Literacy & Numeracy (FLN)",
    challenge:
      "Only 23.4% of Grade 3 students in government schools can read a Grade 2 level text, and only 27.6% can perform basic subtraction (ASER 2024). Many students are unable to meet foundational learning expectations (such as those envisioned in NIPUN Bharat) and continue to struggle in later grades due to weak early instruction and limited remedial support.",
    outputs: [
      {
        narrative: "Students develop phonological awareness necessary for early reading.",
        indicators: [
          "Foundational Literacy. Percentage of students accurately identifying at least 80% of words beginning or ending with a given sound.",
        ],
      },
      {
        narrative: "Students are able to decode and read grade-appropriate texts fluently.",
        indicators: [
          "Percentage of students reading a Grade 2-level text with appropriate speed, accuracy, and expression.",
        ],
      },
      {
        narrative: "Students are able to comprehend grade-appropriate written text.",
        indicators: [
          "Percentage of students accurately answering at least 80% of comprehension questions based on a grade-level paragraph.",
        ],
      },
      {
        narrative: "Students are able to understand spoken language and follow meaning.",
        indicators: [
          "Percentage of students correctly identifying visuals corresponding to at least 80% of spoken sentences.",
        ],
      },
      {
        narrative: "Students are able to express ideas clearly through spoken language.",
        indicators: [
          "Percentage of students able to orally describe a picture or situation using complete and meaningful sentences.",
        ],
      },
      {
        narrative: "Students are able to express ideas clearly through basic writing.",
        indicators: [
          "Percentage of students able to write four meaningful sentences with correct structure and logical flow based on a given picture.",
        ],
      },
      {
        narrative: "Students develop strong number sense appropriate to their grade.",
        indicators: [
          "Percentage of students accurately reading and comparing at least 75% of multi-digit numbers (up to 3 digits for Grade 3; up to 4 digits for Grade 5).",
        ],
      },
      {
        narrative: "Students are able to perform grade-appropriate arithmetic operations.",
        indicators: [
          "Percentage of students accurately solving at least 75% of grade-appropriate arithmetic problems (addition, subtraction, multiplication, division).",
        ],
      },
      {
        narrative: "Students are able to apply numeracy to word problems.",
        indicators: ["Percentage of students correctly solving grade-appropriate word problems."],
      },
      {
        narrative: "Students understand basic measurement concepts.",
        indicators: [
          "Percentage of students correctly identifying and comparing units of time, weight, and length.",
        ],
      },
      {
        narrative: "Students demonstrate grade-appropriate mathematical reasoning.",
        indicators: [
          "Percentage of students able to explain the steps and logic used in solving grade-appropriate math problems.",
        ],
      },
    ],
  },
  {
    theme: "Career Readiness",
    challenge:
      "Only 47% of schools offer skill-based courses for Classes 9 and above, and only 29% of eligible students are enrolled in these courses (PARAKH, 2024). As a result, many adolescents have limited exposure to career guidance, life skills, and diverse pathways, leading to weak aspirations, poor transitions, and early exit or disengagement at the secondary stage.",
    outputs: [
      {
        narrative: "Students demonstrate awareness of diverse education and career pathways.",
        indicators: [
          "Percentage of students able to identify and describe multiple education and career pathways.",
        ],
      },
      {
        narrative: "Students understand the link between education, skills, and career options.",
        indicators: [
          "Percentage of students able to explain how specific subjects or skills connect to different future options.",
        ],
      },
      {
        narrative:
          "Students demonstrate life skills necessary for future success (e.g., critical thinking, communication, financial literacy, problem-solving).",
        indicators: ["Percentage of students who can confidently articulate their career aspirations."],
      },
      {
        narrative: "Students are able to make informed decisions and set realistic goals for their education and career.",
        indicators: ["Percentage of students able to articulate a clear education or career goal."],
      },
      {
        narrative: "Students are able to create a budget and track personal income/expenses.",
        indicators: [
          "Percentage of students who can create a financial budget and track personal income and expenses.",
        ],
      },
      {
        narrative: "Students demonstrate decision-making and goal-setting related to their future.",
        indicators: ["Percentage of students able to articulate a clear education or career goal."],
      },
    ],
  },
]

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.data.logframe])

  // Debounced Save
  useEffect(() => {
    const timer = setTimeout(() => {
      updateProjectData(projectId, "logframe", logframe)
    }, 1000)
    return () => clearTimeout(timer)
  }, [logframe, projectId, updateProjectData])

  // Helper for voice appending
  const handleVoice = (
    section: "level" | "output" | "activity", // level = goal/purpose
    indexOrType: number | "goal" | "purpose",
    field: string,
    subIndex: number | null,
    text: string
  ) => {
    if (section === "level") {
      const type = indexOrType as "goal" | "purpose"
      const currentObj = logframe[type]
      if (subIndex !== null) {
        // Array field
        const list = currentObj[field as keyof LogframeRow] as string[]
        const current = list[subIndex]
        const newList = [...list]
        newList[subIndex] = current ? `${current} ${text}` : text
        updateRowField(type, field as keyof LogframeRow, newList)
      } else {
        // String field
        const current = currentObj[field as keyof LogframeRow] as string
        updateRowField(type, field as keyof LogframeRow, current ? `${current} ${text}` : text)
      }
    } else if (section === "output") {
      const index = indexOrType as number
      const currentObj = logframe.outputs[index]
      if (subIndex !== null) {
        const list = currentObj[field as keyof LogframeRow] as string[]
        const current = list[subIndex]
        const newList = [...list]
        newList[subIndex] = current ? `${current} ${text}` : text
        updateOutputField(index, field as keyof LogframeRow, newList)
      } else {
        const current = currentObj[field as keyof LogframeRow] as string
        updateOutputField(index, field as keyof LogframeRow, current ? `${current} ${text}` : text)
      }
    } else if (section === "activity") {
      const index = indexOrType as number
      const currentObj = logframe.activities[index]
      if (subIndex !== null) {
        // inputs array
        const list = currentObj.inputs
        const current = list[subIndex]
        const newList = [...list]
        newList[subIndex] = current ? `${current} ${text}` : text
        updateActivityField(index, "inputs", newList)
      } else {
        const current = currentObj[field as keyof typeof currentObj] as string
        updateActivityField(index, field as keyof typeof currentObj, current ? `${current} ${text}` : text)
      }
    }
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
  }

  const handleLoadTemplate = (template: (typeof COMMON_LFA_DATA)[0]) => {
    const newLogframe: Logframe = {
      goal: {
        narrative: template.theme,
        indicators: [""],
        mov: [""],
        assumptions: [""],
      },
      purpose: {
        narrative: template.challenge,
        indicators: [""],
        mov: [""],
        assumptions: [""],
      },
      outputs: template.outputs.map((output) => ({
        narrative: output.narrative,
        indicators: output.indicators,
        mov: [""],
        assumptions: [""],
      })),
      activities: [{ narrative: "", inputs: [""], timeline: "", responsible: "" }],
    }

    setLogframe(newLogframe)
  }

  const updateRowField = (level: "goal" | "purpose", field: keyof LogframeRow, value: string | string[]) => {
    const updated = {
      ...logframe,
      [level]: { ...logframe[level], [field]: value },
    }
    setLogframe(updated)
  }

  const updateOutputField = (index: number, field: keyof LogframeRow, value: string | string[]) => {
    const updated = {
      ...logframe,
      outputs: logframe.outputs.map((o, i) => (i === index ? { ...o, [field]: value } : o)),
    }
    setLogframe(updated)
  }

  const addOutput = () => {
    const updated = {
      ...logframe,
      outputs: [...logframe.outputs, { ...defaultRow }],
    }
    setLogframe(updated)
  }

  const removeOutput = (index: number) => {
    if (logframe.outputs.length > 1) {
      const updated = {
        ...logframe,
        outputs: logframe.outputs.filter((_, i) => i !== index),
      }
      setLogframe(updated)
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
  }

  const addActivity = () => {
    const updated = {
      ...logframe,
      activities: [...logframe.activities, { narrative: "", inputs: [""], timeline: "", responsible: "" }],
    }
    setLogframe(updated)
  }

  const removeActivity = (index: number) => {
    if (logframe.activities.length > 1) {
      const updated = {
        ...logframe,
        activities: logframe.activities.filter((_, i) => i !== index),
      }
      setLogframe(updated)
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
              <MicButton onTranscript={(text) => handleVoice("level", level, "narrative", null, text)} />
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
                  <MicButton onTranscript={(text) => handleVoice("level", level, "indicators", i, text)} />
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
                  <MicButton onTranscript={(text) => handleVoice("level", level, "mov", i, text)} />
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
                  <MicButton onTranscript={(text) => handleVoice("level", level, "assumptions", i, text)} />
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Load Common LFA
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {COMMON_LFA_DATA.map((data, index) => (
                  <DropdownMenuItem key={index} onClick={() => handleLoadTemplate(data)}>
                    {data.theme}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
                      <MicButton onTranscript={(text) => handleVoice("output", index, "narrative", null, text)} />
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
                          <MicButton onTranscript={(text) => handleVoice("output", index, "indicators", i, text)} />
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
                          <MicButton onTranscript={(text) => handleVoice("output", index, "mov", i, text)} />
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
                          <MicButton onTranscript={(text) => handleVoice("output", index, "assumptions", i, text)} />
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
                      <MicButton onTranscript={(text) => handleVoice("activity", index, "narrative", null, text)} />
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
                          <MicButton onTranscript={(text) => handleVoice("activity", index, "inputs", i, text)} />
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
                        <MicButton onTranscript={(text) => handleVoice("activity", index, "timeline", null, text)} />
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
                        <MicButton onTranscript={(text) => handleVoice("activity", index, "responsible", null, text)} />
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

