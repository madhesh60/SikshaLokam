"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  FileText,
  Video,
  MessageCircle,
  ExternalLink,
  Target,
  Users,
  GitBranch,
  GitMerge,
  Workflow,
  Table,
  BarChart3,
} from "lucide-react"
import { LFA_STEPS } from "@/lib/demo-store"
import type React from "react"

const iconMap: Record<string, React.ElementType> = {
  target: Target,
  users: Users,
  "git-branch": GitBranch,
  "git-merge": GitMerge,
  workflow: Workflow,
  table: Table,
  "bar-chart": BarChart3,
}

const resources = [
  {
    title: "LFA Beginner's Guide",
    description: "Complete introduction to the Logical Framework Approach",
    type: "Guide",
    icon: BookOpen,
    href: "/docs/lfa-guide",
  },
  {
    title: "Video Tutorials",
    description: "Step-by-step video walkthrough of each LFA step",
    type: "Video",
    icon: Video,
    href: "#",
  },
  {
    title: "Template Library",
    description: "Browse sector-specific templates and examples",
    type: "Templates",
    icon: FileText,
    href: "/templates",
  },
  {
    title: "Community Forum",
    description: "Connect with other NGO practitioners",
    type: "Community",
    icon: MessageCircle,
    href: "/community",
  },
]

const faqs = [
  {
    question: "What is the Logical Framework Approach?",
    answer:
      "LFA is a structured planning methodology used by NGOs, governments, and donors to design, monitor, and evaluate programs. It helps you clearly define problems, objectives, indicators, and assumptions.",
  },
  {
    question: "Do I need to complete all 7 steps?",
    answer:
      "Yes, all 7 steps build on each other to create a comprehensive program design. However, you can save and return at any point.",
  },
  {
    question: "Can I collaborate with my team?",
    answer:
      "Yes! You can invite team members to collaborate on your program designs. They can view, edit, and comment based on their permissions.",
  },
  {
    question: "How do I export my program design?",
    answer:
      "Once you complete your design, you can export it as a PDF report, Word document, Excel spreadsheet, or PowerPoint presentation.",
  },
]

export default function HelpPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Help & Resources</h1>
        <p className="text-muted-foreground">Learn about LFA and get support for using the platform</p>
      </div>

      {/* Quick Resources */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {resources.map((resource) => (
          <Card key={resource.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <resource.icon className="h-5 w-5 text-primary" />
                <Badge variant="secondary">{resource.type}</Badge>
              </div>
              <CardTitle className="text-base">{resource.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3">{resource.description}</CardDescription>
              <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                <Link href={resource.href}>
                  Access
                  <ExternalLink className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* LFA Steps Overview */}
      <Card>
        <CardHeader>
          <CardTitle>The 7-Step LFA Process</CardTitle>
          <CardDescription>
            Each step builds on the previous one to create a comprehensive program design
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {LFA_STEPS.map((step) => {
              const Icon = iconMap[step.icon] || Target
              return (
                <div key={step.id} className="flex items-start gap-4 p-4 rounded-lg border border-border">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Step {step.id}</span>
                      <h3 className="font-semibold text-foreground">{step.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="space-y-2">
              <h3 className="font-medium text-foreground">{faq.question}</h3>
              <p className="text-sm text-muted-foreground">{faq.answer}</p>
              {index < faqs.length - 1 && <div className="border-b border-border pt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-foreground">Need more help?</h3>
              <p className="text-sm text-muted-foreground">
                Our support team is here to help you succeed with your program designs.
              </p>
            </div>
            <Button>Contact Support</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

