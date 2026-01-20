"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useDemoStore } from "@/lib/demo-store"
import { AppSidebar } from "@/components/app/sidebar"
import { AppHeader } from "@/components/app/header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { BadgeNotification } from "@/components/app/badge-notification"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isOnboarded } = useDemoStore()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else if (!isOnboarded && pathname !== "/onboarding") {
      router.push("/onboarding")
    }
  }, [user, isOnboarded, pathname, router])

  if (!user || !isOnboarded) {
    return null
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 bg-muted/30 min-h-[calc(100vh-4rem)]">{children}</main>
      </SidebarInset>
      <BadgeNotification />
    </SidebarProvider>
  )
}

