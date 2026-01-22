"use client"

import { useEffect, useState, useRef } from "react"
import { useDemoStore, BADGES } from "@/lib/demo-store"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import confetti from "canvas-confetti"

export function BadgeNotification() {
  const { badges } = useDemoStore()
  const [showBadge, setShowBadge] = useState<(typeof BADGES)[number] | null>(null)

  // Use a ref to track initial load to prevent notification spam on refresh
  const isFirstLoad = useRef(true)
  const previousBadgesRef = useRef<string[]>([])

  useEffect(() => {
    // On first load, just sync the ref and don't show notifications
    if (isFirstLoad.current) {
      previousBadgesRef.current = badges
      isFirstLoad.current = false
      return
    }

    // Check for new badges
    if (badges.length > previousBadgesRef.current.length) {
      // Find the new badge(s)
      const newBadgeIds = badges.filter(id => !previousBadgesRef.current.includes(id))

      if (newBadgeIds.length > 0) {
        // Just show the last one to avoid spamming multiple dialogs
        const latestBadgeId = newBadgeIds[newBadgeIds.length - 1]
        const newBadge = BADGES.find((b) => b.id === latestBadgeId)

        if (newBadge) {
          setShowBadge(newBadge)
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#4338ca", "#7c3aed", "#fbbf24"],
          })
        }
      }
    }

    // Update ref
    previousBadgesRef.current = badges
  }, [badges])

  if (!showBadge) return null

  return (
    <Dialog open={!!showBadge} onOpenChange={() => setShowBadge(null)}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogTitle className="sr-only">Badge Earned: {showBadge.name}</DialogTitle>
        <div className="flex flex-col items-center py-6">
          <div className="text-6xl mb-4 animate-bounce">{showBadge.icon}</div>
          <DialogTitle className="text-2xl font-bold text-foreground mb-2">Badge Earned!</DialogTitle>
          <h3 className="text-xl font-semibold text-primary mb-2">{showBadge.name}</h3>
          <p className="text-muted-foreground mb-6">{showBadge.description}</p>
          <Button onClick={() => setShowBadge(null)}>Awesome!</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

