"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { useDemoStore } from "@/lib/demo-store"

const pathNames: Record<string, string> = {
  dashboard: "Dashboard",
  projects: "My Projects",
  templates: "Templates",
  assistant: "AI Assistant",
  achievements: "Achievements",
  help: "Help & Resources",
  settings: "Settings",
  design: "Program Design",
}

export function AppHeader() {
  const pathname = usePathname()
  const { currentProject } = useDemoStore()

  const segments = pathname.split("/").filter(Boolean)
  const isDesignPage = segments.includes("design")

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <Breadcrumb className="flex-1">
        <BreadcrumbList>
          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1
            const href = "/" + segments.slice(0, index + 1).join("/")
            const displayName = pathNames[segment] || (isDesignPage && currentProject ? currentProject.name : segment)

            return (
              <React.Fragment key={segment}>
                <BreadcrumbItem>
                  {!isLast ? (
                    <BreadcrumbLink href={href}>{displayName}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{displayName}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-4 w-4" />
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
          2
        </span>
        <span className="sr-only">Notifications</span>
      </Button>
    </header>
  )
}

