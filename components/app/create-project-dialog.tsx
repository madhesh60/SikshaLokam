"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { TEMPLATES } from "@/lib/demo-store"
import { Check, Star } from "lucide-react"

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateProject: (name: string, description: string, templateId?: string) => void
  defaultTemplateId?: string
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  onCreateProject,
  defaultTemplateId,
}: CreateProjectDialogProps) {
  const [step, setStep] = useState<"template" | "details">("template")
  const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>(defaultTemplateId)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  // Reset when dialog opens
  useEffect(() => {
    if (open) {
      setStep(defaultTemplateId ? "details" : "template")
      setSelectedTemplate(defaultTemplateId)
      setName("")
      setDescription("")

      // Pre-fill from template if selected
      if (defaultTemplateId) {
        const template = TEMPLATES.find((t) => t.id === defaultTemplateId)
        if (template && template.id !== "blank") {
          setName(`${template.name} - ${new Date().toLocaleDateString()}`)
          setDescription(template.description)
        }
      }
    }
  }, [open, defaultTemplateId])

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = TEMPLATES.find((t) => t.id === templateId)
    if (template && template.id !== "blank") {
      setName(`${template.name} - ${new Date().toLocaleDateString()}`)
      setDescription(template.description)
    } else {
      setName("")
      setDescription("")
    }
    setStep("details")
  }

  const handleBack = () => {
    setStep("template")
  }

  const handleCreate = () => {
    if (name.trim()) {
      onCreateProject(name.trim(), description.trim(), selectedTemplate)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        {step === "template" ? (
          <>
            <DialogHeader>
              <DialogTitle>Create New Program</DialogTitle>
              <DialogDescription>Choose a template to get started or start from scratch</DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 py-4 max-h-[60vh] overflow-y-auto">
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template.id)}
                  className={`flex items-start gap-4 p-4 rounded-lg border text-left transition-colors ${
                    selectedTemplate === template.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <div className="relative h-16 w-24 shrink-0 rounded-md overflow-hidden bg-muted">
                    <Image
                      src={template.preview || "/placeholder.svg"}
                      alt={template.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">{template.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {template.category}
                      </Badge>
                      {template.popularity > 85 && (
                        <div className="flex items-center gap-0.5 text-xs text-accent">
                          <Star className="h-3 w-3 fill-current" />
                          Popular
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                    {template.sectors.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {template.sectors.map((sector) => (
                          <Badge key={sector} variant="outline" className="text-xs">
                            {sector}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedTemplate === template.id && <Check className="h-5 w-5 text-primary shrink-0" />}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Program Details</DialogTitle>
              <DialogDescription>
                {selectedTemplate && selectedTemplate !== "blank"
                  ? `Based on: ${TEMPLATES.find((t) => t.id === selectedTemplate)?.name}`
                  : "Starting from scratch"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Program Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Rural Education Initiative 2026"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Briefly describe your program's goals and target audience..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={handleBack}>
                Back to Templates
              </Button>
              <Button onClick={handleCreate} disabled={!name.trim()}>
                Create Program
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
