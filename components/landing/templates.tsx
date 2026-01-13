"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Star } from "lucide-react"
import { TEMPLATES } from "@/lib/demo-store"

export function Templates() {
  const displayTemplates = TEMPLATES.filter((t) => t.id !== "blank").slice(0, 4)

  return (
    <section id="templates" className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Quick Start
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4 text-balance">
            Start with Proven Templates
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose from sector-specific templates designed by experienced practitioners, or start from scratch with full
            flexibility.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {displayTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden border-border/50 hover:shadow-lg transition-shadow">
              <div className="relative h-40 bg-muted">
                <Image src={template.preview || "/placeholder.svg"} alt={template.name} fill className="object-cover" />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="secondary" className="text-xs">
                    {template.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-accent text-accent" />
                    {template.popularity}%
                  </div>
                </div>
                <CardTitle className="text-base">{template.name}</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <CardDescription className="text-xs line-clamp-2">{template.description}</CardDescription>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
                  <Link href={`/register?template=${template.id}`}>
                    Use Template
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View All */}
        <div className="text-center">
          <Button variant="outline" asChild>
            <Link href="/templates">
              Browse All Templates
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
