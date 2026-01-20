"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDemoStore, TEMPLATES } from "@/lib/demo-store"
import { Search, Star, ArrowRight, Sparkles, FileText, BookOpen, Building, Users2 } from "lucide-react"
import { CreateProjectDialog } from "@/components/app/create-project-dialog"

const categories = [
  { id: "all", name: "All Templates", icon: FileText },
  { id: "Education", name: "Education", icon: BookOpen },
  { id: "EdTech", name: "EdTech", icon: Sparkles },
  { id: "Community", name: "Community", icon: Users2 },
  { id: "Custom", name: "Custom", icon: Building },
]

export default function TemplatesPage() {
  const router = useRouter()
  const { createProject, setCurrentProject } = useDemoStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>()

  const filteredTemplates = TEMPLATES.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.sectors.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = activeCategory === "all" || template.category === activeCategory

    return matchesSearch && matchesCategory
  }).sort((a, b) => b.popularity - a.popularity)

  const handleUseTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
    setCreateDialogOpen(true)
  }

  const handleCreateProject = (name: string, description: string, templateId?: string) => {
    const project = createProject(name, description, templateId)
    setCurrentProject(project)
    router.push(`/projects/${project.id}/design`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Template Library</h1>
        <p className="text-muted-foreground">Start with proven templates designed by experienced practitioners</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="h-auto flex-wrap">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="gap-2">
                <category.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredTemplates.length} template{filteredTemplates.length !== 1 ? "s" : ""}
      </p>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4">
              <FileText className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">No templates found</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Try adjusting your search or category filters
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              {/* Preview Image */}
              <div className="relative h-44 bg-muted overflow-hidden">
                <Image
                  src={template.preview || "/placeholder.svg"}
                  alt={template.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {template.popularity > 85 && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-accent text-accent-foreground gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Popular
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Badge variant="secondary" className="shrink-0">
                    {template.category}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pb-4">
                <CardDescription className="line-clamp-2 mb-3">{template.description}</CardDescription>

                {template.sectors.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {template.sectors.map((sector) => (
                      <Badge key={sector} variant="outline" className="text-xs">
                        {sector}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-0 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                  <button
                    onClick={() => {
                      /* Preview would go here */
                    }}
                  >
                    Preview
                  </button>
                </Button>
                <Button size="sm" className="flex-1" onClick={() => handleUseTemplate(template.id)}>
                  Use Template
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <CreateProjectDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreateProject={handleCreateProject}
        defaultTemplateId={selectedTemplate}
      />
    </div>
  )
}

