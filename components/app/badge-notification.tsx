"use client"

import { useEffect, useState } from "react"
import { useDemoStore, BADGES } from "@/lib/demo-store"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import confetti from "canvas-confetti"

export function BadgeNotification() {
  const { badges } = useDemoStore()
  const [showBadge, setShowBadge] = useState<(typeof BADGES)[number] | null>(null)
  const [lastBadgeCount, setLastBadgeCount] = useState(badges.length)

  useEffect(() => {
    if (badges.length > lastBadgeCount) {
      // New badge earned!
      const newBadgeId = badges[badges.length - 1]
      const newBadge = BADGES.find((b) => b.id === newBadgeId)

      if (newBadge) {
        setShowBadge(newBadge)

        // Trigger confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#0d9488", "#f59e0b", "#10b981"],
        })
      }
    }
    setLastBadgeCount(badges.length)
  }, [badges, lastBadgeCount])

  if (!showBadge) return null

  return (
    <Dialog open={!!showBadge} onOpenChange={() => setShowBadge(null)}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogTitle className="sr-only">Badge Earned: {showBadge.name}</DialogTitle>
        <div className="flex flex-col items-center py-6">
          <div className="text-6xl mb-4 animate-bounce">{showBadge.icon}</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Badge Earned!</h2>
          <h3 className="text-xl font-semibold text-primary mb-2">{showBadge.name}</h3>
          <p className="text-muted-foreground mb-6">{showBadge.description}</p>
          <Button onClick={() => setShowBadge(null)}>Awesome!</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
