"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useDemoStore } from "@/lib/demo-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileText,
  FileSpreadsheet,
  Presentation,
  ArrowLeft,
  Edit3,
  Share2,
  Printer,
  Target,
  Users,
  TreeDeciduous,
  Lightbulb,
  Link2,
  LayoutGrid,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

const stepIcons = [
  { icon: Target, label: "Problem Definition" },
  { icon: Users, label: "Stakeholder Analysis" },
  { icon: TreeDeciduous, label: "Problem Tree" },
  { icon: Lightbulb, label: "Objective Tree" },
  { icon: Link2, label: "Results Chain" },
  { icon: LayoutGrid, label: "Logical Framework" },
  { icon: BarChart3, label: "Monitoring Framework" },
]

export default function ReviewPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { projects, user, earnBadge } = useDemoStore()
  const [project, setProject] = useState(projects.find((p) => p.id === id))
  const [isExporting, setIsExporting] = useState<string | null>(null)

  useEffect(() => {
    const found = projects.find((p) => p.id === id)
    if (found) {
      setProject(found)
    }
  }, [projects, id])

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Project not found</h2>
        <Button asChild>
          <Link href="/projects">Back to Projects</Link>
        </Button>
      </div>
    )
  }

  const completedSteps = project.completedSteps?.length || 0
  const totalSteps = 7
  const completionPercentage = Math.round((completedSteps / totalSteps) * 100)
  const isComplete = completedSteps === totalSteps

  const handleExport = async (format: string) => {
    setIsExporting(format)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (user && !user.badges?.includes("first-export")) {
      earnBadge("first-export")
    }

    const exportContent = generateExportContent(project, format)
    const blob = new Blob([exportContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${project.name.replace(/\s+/g, "-").toLowerCase()}-lfa.${format === "pdf" ? "txt" : format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setIsExporting(null)
  }

  const generateExportContent = (proj: typeof project, format: string) => {
    const lines = [
      "=".repeat(60),
      `LOGICAL FRAMEWORK APPROACH - ${proj.name.toUpperCase()}`,
      "=".repeat(60),
      "",
      `Organization: ${proj.organization}`,
      `Created: ${new Date(proj.createdAt).toLocaleDateString()}`,
      `Last Updated: ${new Date(proj.updatedAt).toLocaleDateString()}`,
      `Completion: ${completionPercentage}%`,
      "",
      "-".repeat(60),
      "STEP 1: PROBLEM DEFINITION",
      "-".repeat(60),
      "",
      `Central Problem: ${proj.data.problemDefinition?.centralProblem || "Not defined"}`,
      `Context: ${proj.data.problemDefinition?.context || "Not defined"}`,
      `Target Beneficiaries: ${proj.data.problemDefinition?.targetBeneficiaries || "Not defined"}`,
      `Geographic Scope: ${proj.data.problemDefinition?.geographicScope || "Not defined"}`,
      "",
      "-".repeat(60),
      "STEP 2: STAKEHOLDER ANALYSIS",
      "-".repeat(60),
      "",
    ]

    if (proj.data.stakeholders?.length) {
      proj.data.stakeholders.forEach((s, i) => {
        lines.push(`${i + 1}. ${s.name} (${s.type})`)
        lines.push(`   Interest: ${s.interest} | Influence: ${s.influence}`)
        lines.push(`   Expectations: ${s.expectations || "N/A"}`)
        lines.push("")
      })
    } else {
      lines.push("No stakeholders defined")
      lines.push("")
    }

    lines.push("-".repeat(60))
    lines.push("STEP 3: PROBLEM TREE")
    lines.push("-".repeat(60))
    lines.push("")
    lines.push(`Central Problem: ${proj.data.problemTree?.centralProblem || "Not defined"}`)

    if (proj.data.problemTree?.causes?.length) {
      lines.push("")
      lines.push("Causes:")
      proj.data.problemTree.causes.forEach((c, i) => {
        lines.push(`  ${i + 1}. ${c.text}`)
      })
    }

    if (proj.data.problemTree?.effects?.length) {
      lines.push("")
      lines.push("Effects:")
      proj.data.problemTree.effects.forEach((e, i) => {
        lines.push(`  ${i + 1}. ${e.text}`)
      })
    }

    lines.push("")
    lines.push("-".repeat(60))
    lines.push("STEP 4: OBJECTIVE TREE")
    lines.push("-".repeat(60))
    lines.push("")
    lines.push(`Main Objective: ${proj.data.objectiveTree?.centralObjective || "Not defined"}`)

    if (proj.data.objectiveTree?.means?.length) {
      lines.push("")
      lines.push("Means:")
      proj.data.objectiveTree.means.forEach((m, i) => {
        lines.push(`  ${i + 1}. ${m.text}`)
      })
    }

    if (proj.data.objectiveTree?.ends?.length) {
      lines.push("")
      lines.push("Ends:")
      proj.data.objectiveTree.ends.forEach((e, i) => {
        lines.push(`  ${i + 1}. ${e.text}`)
      })
    }

    lines.push("")
    lines.push("-".repeat(60))
    lines.push("STEP 5: RESULTS CHAIN (THEORY OF CHANGE)")
    lines.push("-".repeat(60))
    lines.push("")

    const chainElements = ["inputs", "activities", "outputs", "outcomes"] as const
    chainElements.forEach((element) => {
      const items = proj.data.resultsChain?.[element] || []
      lines.push(`${element.charAt(0).toUpperCase() + element.slice(1)}:`)
      if (items.length) {
        items.forEach((item, i) => {
          lines.push(`  ${i + 1}. ${item}`)
        })
      } else {
        lines.push("  Not defined")
      }
      lines.push("")
    })
    lines.push(`Impact: ${proj.data.resultsChain?.impact || "Not defined"}`)

    lines.push("")
    lines.push("-".repeat(60))
    lines.push("STEP 6: LOGICAL FRAMEWORK MATRIX")
    lines.push("-".repeat(60))
    lines.push("")

    const logframe = proj.data.logframe
    if (logframe) {
      lines.push("Goal:")
      lines.push(`  Narrative: ${logframe.goal?.narrative || "Not defined"}`)
      lines.push(`  Indicators: ${logframe.goal?.indicators?.join(", ") || "Not defined"}`)
      lines.push("")
      lines.push("Purpose:")
      lines.push(`  Narrative: ${logframe.purpose?.narrative || "Not defined"}`)
      lines.push(`  Indicators: ${logframe.purpose?.indicators?.join(", ") || "Not defined"}`)
      lines.push("")
      lines.push("Outputs:")
      logframe.outputs?.forEach((output, i) => {
        lines.push(`  ${i + 1}. ${output.narrative}`)
      })
      lines.push("")
      lines.push("Activities:")
      logframe.activities?.forEach((activity, i) => {
        lines.push(`  ${i + 1}. ${activity.narrative}`)
      })
    }

    lines.push("")
    lines.push("-".repeat(60))
    lines.push("STEP 7: MONITORING FRAMEWORK")
    lines.push("-".repeat(60))
    lines.push("")

    if (proj.data.monitoring?.indicators?.length) {
      proj.data.monitoring.indicators.forEach((ind, i) => {
        lines.push(`Indicator ${i + 1}: ${ind.name}`)
        lines.push(`  Baseline: ${ind.baseline || "N/A"}`)
        lines.push(`  Target: ${ind.target || "N/A"}`)
        lines.push(`  Frequency: ${ind.frequency || "N/A"}`)
        lines.push(`  Data Source: ${ind.source || "N/A"}`)
        lines.push(`  Responsible: ${ind.responsible || "N/A"}`)
        lines.push("")
      })
    } else {
      lines.push("No indicators defined")
    }

    lines.push("")
    lines.push("=".repeat(60))
    lines.push("Generated by Shiksha Raha Common LFA Platform")
    lines.push(`Export Date: ${new Date().toLocaleString()}`)
    lines.push("=".repeat(60))

    return lines.join("\n")
  }

  const getStepStatus = (stepNum: number) => {
    if (project.completedSteps?.includes(stepNum)) {
      return "complete"
    }
    if (project.currentStep === stepNum) {
      return "current"
    }
    return "pending"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/projects/${id}/design`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground">{project.organization}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/projects/${id}/design`}>
              <Edit3 className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Completion Status</CardTitle>
              <CardDescription>
                {completedSteps} of {totalSteps} steps completed
              </CardDescription>
            </div>
            <Badge variant={isComplete ? "default" : "secondary"} className={isComplete ? "bg-green-600" : ""}>
              {isComplete ? "Complete" : "In Progress"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={completionPercentage} className="h-3" />
            <div className="grid grid-cols-7 gap-2">
              {stepIcons.map((step, index) => {
                const status = getStepStatus(index + 1)
                const StepIcon = step.icon
                return (
                  <div
                    key={index}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg text-center ${status === "complete"
                      ? "bg-green-50 text-green-700"
                      : status === "current"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                      }`}
                  >
                    <div
                      className={`p-2 rounded-full ${status === "complete" ? "bg-green-100" : status === "current" ? "bg-primary/20" : "bg-muted"
                        }`}
                    >
                      {status === "complete" ? <CheckCircle2 className="h-4 w-4" /> : <StepIcon className="h-4 w-4" />}
                    </div>
                    <span className="text-[10px] font-medium leading-tight hidden md:block">{step.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Your Framework
          </CardTitle>
          <CardDescription>Download your LFA in various formats for sharing and presentation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 bg-transparent"
              onClick={() => handleExport("pdf")}
              disabled={isExporting !== null}
            >
              <FileText className="h-8 w-8 text-red-500" />
              <span className="font-medium">PDF Document</span>
              <span className="text-xs text-muted-foreground">For printing & sharing</span>
              {isExporting === "pdf" && <span className="text-xs">Generating...</span>}
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 bg-transparent"
              onClick={() => handleExport("docx")}
              disabled={isExporting !== null}
            >
              <FileText className="h-8 w-8 text-blue-500" />
              <span className="font-medium">Word Document</span>
              <span className="text-xs text-muted-foreground">For editing & proposals</span>
              {isExporting === "docx" && <span className="text-xs">Generating...</span>}
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 bg-transparent"
              onClick={() => handleExport("xlsx")}
              disabled={isExporting !== null}
            >
              <FileSpreadsheet className="h-8 w-8 text-green-500" />
              <span className="font-medium">Excel Spreadsheet</span>
              <span className="text-xs text-muted-foreground">For data analysis</span>
              {isExporting === "xlsx" && <span className="text-xs">Generating...</span>}
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 bg-transparent"
              onClick={() => handleExport("pptx")}
              disabled={isExporting !== null}
            >
              <Presentation className="h-8 w-8 text-orange-500" />
              <span className="font-medium">Presentation</span>
              <span className="text-xs text-muted-foreground">For stakeholder meetings</span>
              {isExporting === "pptx" && <span className="text-xs">Generating...</span>}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Framework Summary - Updated to use correct data structure */}
      <Card>
        <CardHeader>
          <CardTitle>Framework Summary</CardTitle>
          <CardDescription>Review all components of your logical framework</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="problem">Problem</TabsTrigger>
              <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
              <TabsTrigger value="trees">Trees</TabsTrigger>
              <TabsTrigger value="chain">Chain</TabsTrigger>
              <TabsTrigger value="logframe">Logframe</TabsTrigger>
              <TabsTrigger value="monitoring">M&E</TabsTrigger>
              <TabsTrigger value="validation">Validation</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Project Details</h4>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p>
                      <span className="font-medium text-foreground">Name:</span> {project.name}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Organization:</span> {project.organization}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Template:</span> {project.templateId || "Custom"}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Status:</span> {project.status}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Central Problem</h4>
                  <p className="text-sm text-muted-foreground">
                    {project.data.problemDefinition?.centralProblem || "Not yet defined"}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium">Main Objective</h4>
                <p className="text-sm text-muted-foreground">
                  {project.data.objectiveTree?.centralObjective || "Not yet defined"}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="problem" className="mt-6 space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Central Problem</h4>
                  <p className="text-sm bg-muted p-3 rounded-lg">
                    {project.data.problemDefinition?.centralProblem || "Not defined"}
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Context</h4>
                    <p className="text-sm text-muted-foreground">
                      {project.data.problemDefinition?.context || "Not defined"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Target Beneficiaries</h4>
                    <p className="text-sm text-muted-foreground">
                      {project.data.problemDefinition?.targetBeneficiaries || "Not defined"}
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Geographic Scope</h4>
                    <p className="text-sm text-muted-foreground">
                      {project.data.problemDefinition?.geographicScope || "Not defined"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Urgency Level</h4>
                    <Badge variant="outline">{project.data.problemDefinition?.urgency || "Not set"}</Badge>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stakeholders" className="mt-6">
              {project.data.stakeholders?.length ? (
                <div className="space-y-3">
                  {project.data.stakeholders.map((s, i) => (
                    <div key={i} className="flex items-start gap-4 p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{s.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {s.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{s.expectations}</p>
                      </div>
                      <div className="text-right text-sm">
                        <p>
                          Interest: <span className="font-medium">{s.interest}</span>
                        </p>
                        <p>
                          Influence: <span className="font-medium">{s.influence}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No stakeholders defined yet</p>
              )}
            </TabsContent>

            <TabsContent value="trees" className="mt-6 space-y-6">
              <div>
                <h4 className="font-medium mb-3">Problem Tree</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Causes</span>
                    {project.data.problemTree?.causes?.length ? (
                      <ul className="space-y-1">
                        {project.data.problemTree.causes.map((c, i) => (
                          <li key={i} className="text-sm bg-red-50 text-red-700 p-2 rounded">
                            {c.text}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">None defined</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Central Problem</span>
                    <div className="bg-amber-50 text-amber-700 p-3 rounded font-medium text-center">
                      {project.data.problemTree?.centralProblem || "Not defined"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Effects</span>
                    {project.data.problemTree?.effects?.length ? (
                      <ul className="space-y-1">
                        {project.data.problemTree.effects.map((e, i) => (
                          <li key={i} className="text-sm bg-orange-50 text-orange-700 p-2 rounded">
                            {e.text}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">None defined</p>
                    )}
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium mb-3">Objective Tree</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Means</span>
                    {project.data.objectiveTree?.means?.length ? (
                      <ul className="space-y-1">
                        {project.data.objectiveTree.means.map((m, i) => (
                          <li key={i} className="text-sm bg-blue-50 text-blue-700 p-2 rounded">
                            {m.text}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">None defined</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Main Objective</span>
                    <div className="bg-green-50 text-green-700 p-3 rounded font-medium text-center">
                      {project.data.objectiveTree?.centralObjective || "Not defined"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Ends</span>
                    {project.data.objectiveTree?.ends?.length ? (
                      <ul className="space-y-1">
                        {project.data.objectiveTree.ends.map((e, i) => (
                          <li key={i} className="text-sm bg-emerald-50 text-emerald-700 p-2 rounded">
                            {e.text}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">None defined</p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="chain" className="mt-6">
              <div className="flex flex-col lg:flex-row gap-4 overflow-x-auto pb-4">
                {(["inputs", "activities", "outputs", "outcomes"] as const).map((stage, index) => (
                  <div key={stage} className="flex items-center gap-2">
                    <div className="min-w-[160px] space-y-2">
                      <h4 className="font-medium text-sm text-center capitalize">{stage}</h4>
                      <div className="bg-muted rounded-lg p-3 min-h-[100px]">
                        {project.data.resultsChain?.[stage]?.length ? (
                          <ul className="space-y-1 text-sm">
                            {project.data.resultsChain[stage].map((item, i) => (
                              <li key={i} className="bg-background p-2 rounded">
                                {item}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-muted-foreground text-center">Not defined</p>
                        )}
                      </div>
                    </div>
                    {index < 3 && <div className="text-muted-foreground hidden lg:block">→</div>}
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <div className="text-muted-foreground hidden lg:block">→</div>
                  <div className="min-w-[160px] space-y-2">
                    <h4 className="font-medium text-sm text-center">Impact</h4>
                    <div className="bg-primary/10 rounded-lg p-3 min-h-[100px]">
                      <p className="text-sm text-center">{project.data.resultsChain?.impact || "Not defined"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="logframe" className="mt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-2 text-left font-medium">Level</th>
                      <th className="border p-2 text-left font-medium">Narrative Summary</th>
                      <th className="border p-2 text-left font-medium">Indicators</th>
                      <th className="border p-2 text-left font-medium">Means of Verification</th>
                      <th className="border p-2 text-left font-medium">Assumptions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2 font-medium bg-muted/50">Goal</td>
                      <td className="border p-2">{project.data.logframe?.goal?.narrative || "-"}</td>
                      <td className="border p-2">{project.data.logframe?.goal?.indicators?.join(", ") || "-"}</td>
                      <td className="border p-2">{project.data.logframe?.goal?.mov?.join(", ") || "-"}</td>
                      <td className="border p-2">{project.data.logframe?.goal?.assumptions?.join(", ") || "-"}</td>
                    </tr>
                    <tr>
                      <td className="border p-2 font-medium bg-muted/50">Purpose</td>
                      <td className="border p-2">{project.data.logframe?.purpose?.narrative || "-"}</td>
                      <td className="border p-2">{project.data.logframe?.purpose?.indicators?.join(", ") || "-"}</td>
                      <td className="border p-2">{project.data.logframe?.purpose?.mov?.join(", ") || "-"}</td>
                      <td className="border p-2">{project.data.logframe?.purpose?.assumptions?.join(", ") || "-"}</td>
                    </tr>
                    {project.data.logframe?.outputs?.map((output, i) => (
                      <tr key={`output-${i}`}>
                        <td className="border p-2 font-medium bg-muted/50">Output {i + 1}</td>
                        <td className="border p-2">{output.narrative || "-"}</td>
                        <td className="border p-2">{output.indicators?.join(", ") || "-"}</td>
                        <td className="border p-2">{output.mov?.join(", ") || "-"}</td>
                        <td className="border p-2">{output.assumptions?.join(", ") || "-"}</td>
                      </tr>
                    )) || (
                        <tr>
                          <td className="border p-2 font-medium bg-muted/50">Outputs</td>
                          <td className="border p-2" colSpan={4}>
                            -
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="monitoring" className="mt-6">
              {project.data.monitoring?.indicators?.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border p-2 text-left font-medium">Indicator</th>
                        <th className="border p-2 text-left font-medium">Type</th>
                        <th className="border p-2 text-left font-medium">Baseline</th>
                        <th className="border p-2 text-left font-medium">Target</th>
                        <th className="border p-2 text-left font-medium">Frequency</th>
                        <th className="border p-2 text-left font-medium">Source</th>
                        <th className="border p-2 text-left font-medium">Responsible</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.data.monitoring.indicators.map((ind, i) => (
                        <tr key={i}>
                          <td className="border p-2 font-medium">{ind.name}</td>
                          <td className="border p-2">
                            <Badge variant="outline" className="text-xs">
                              {ind.type}
                            </Badge>
                          </td>
                          <td className="border p-2">{ind.baseline || "-"}</td>
                          <td className="border p-2">{ind.target || "-"}</td>
                          <td className="border p-2">{ind.frequency || "-"}</td>
                          <td className="border p-2">{ind.source || "-"}</td>
                          <td className="border p-2">{ind.responsible || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No monitoring indicators defined yet</p>
              )}
            </TabsContent>

            <TabsContent value="validation" className="mt-6">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    { step: 1, name: "Problem Definition" },
                    { step: 2, name: "Stakeholder Analysis" },
                    { step: 6, name: "Logical Framework Matrix" },
                    { step: 7, name: "Monitoring Framework" },
                  ].map(({ step, name }) => {
                    const isStepComplete = project.completedSteps?.includes(step)
                    return (
                      <Card key={step} className={isStepComplete ? "border-green-200 bg-green-50" : ""}>
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-3">
                            {isStepComplete ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-muted-foreground" />
                            )}
                            <div>
                              <p className="font-medium">{name}</p>
                              <p className="text-sm text-muted-foreground">{isStepComplete ? "Complete" : "Pending"}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
                {!isComplete && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-800">Framework Incomplete</p>
                        <p className="text-sm text-amber-700 mt-1">
                          Complete all 7 steps to generate a validated logical framework. You have {7 - completedSteps}{" "}
                          steps remaining.
                        </p>
                        <Button size="sm" className="mt-3" asChild>
                          <Link href={`/projects/${id}/design`}>Continue Editing</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {isComplete && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-800">Framework Complete</p>
                        <p className="text-sm text-green-700 mt-1">
                          Your logical framework is complete and ready for export. All validation checks passed.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
