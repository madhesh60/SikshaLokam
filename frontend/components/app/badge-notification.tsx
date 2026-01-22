"use client"

import { useEffect, useState, useRef } from "react"
import { useDemoStore, BADGES } from "@/lib/demo-store"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import confetti from "canvas-confetti"

export function BadgeNotification() {
  const { badges } = useDemoStore()
  const [showBadge, setShowBadge] = useState<(typeof BADGES)[number] | null>(null)

  // Track badges that have already been processed/shown to the user
  const processedBadges = useRef(new Set<string>(badges))
  const isFirstRender = useRef(true)

  useEffect(() => {
    // If it's the very first render, ensure we mark all current badges as seen
    // so we don't notify for them.
    if (isFirstRender.current) {
      badges.forEach((id) => processedBadges.current.add(id))
      isFirstRender.current = false
      return
    }

    // Identify truly new badges by checking against our processed set
    // This handles cases where 'previousBadges' might be stale or cleared
    const newBadgeIds = badges.filter((id) => !processedBadges.current.has(id))

    if (newBadgeIds.length > 0) {
      // Mark these as processed immediately
      newBadgeIds.forEach((id) => processedBadges.current.add(id))

      // Only show a notification if it's a single new badge
      // If we receive multiple badges at once (e.g. >1), it's likely a data sync
      // or hydration event, so we suppress the potential spam.
      if (newBadgeIds.length === 1) {
        const latestBadgeId = newBadgeIds[0]
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
