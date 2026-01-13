"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useDemoStore, BADGES } from "@/lib/demo-store"
import { Trophy, Lock, CheckCircle2, Star, TrendingUp } from "lucide-react"

export default function AchievementsPage() {
  const { badges, projects } = useDemoStore()

  const earnedBadges = BADGES.filter((b) => badges.includes(b.id))
  const lockedBadges = BADGES.filter((b) => !badges.includes(b.id))

  const totalProgress = Math.round((earnedBadges.length / BADGES.length) * 100)
  const completedProjects = projects.filter((p) => p.status === "completed").length

  // Calculate stats
  const stats = [
    { label: "Badges Earned", value: earnedBadges.length, total: BADGES.length, icon: Trophy },
    { label: "Programs Completed", value: completedProjects, total: projects.length || 1, icon: CheckCircle2 },
    { label: "Achievement Progress", value: totalProgress, total: 100, icon: TrendingUp, isPercent: true },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Achievements</h1>
        <p className="text-muted-foreground">Track your progress and earn badges as you design programs</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.value}
                {stat.isPercent ? "%" : `/${stat.total}`}
              </div>
              <Progress value={(stat.value / stat.total) * 100} className="mt-2 h-1.5" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Earned Badges */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-accent" />
          <h2 className="text-xl font-semibold">Earned Badges ({earnedBadges.length})</h2>
        </div>

        {earnedBadges.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">No badges yet</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Complete steps in your program design to earn your first badge!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {earnedBadges.map((badge) => (
              <Card key={badge.id} className="bg-accent/5 border-accent/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent/20 text-2xl">
                      {badge.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{badge.name}</h3>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                      <Badge variant="secondary" className="mt-2 bg-accent/10 text-accent-foreground">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Earned
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Locked Badges */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-muted-foreground">Locked Badges ({lockedBadges.length})</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lockedBadges.map((badge) => (
            <Card key={badge.id} className="bg-muted/30 border-border/50 opacity-75">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-muted text-2xl grayscale">
                    {badge.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{badge.name}</h3>
                    <p className="text-sm text-muted-foreground">{badge.description}</p>
                    <Badge variant="outline" className="mt-2">
                      <Lock className="mr-1 h-3 w-3" />
                      Locked
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tips */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-base">How to Earn Badges</CardTitle>
          <CardDescription>Complete these milestones to unlock achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2">
            {[
              "Create your first program design",
              "Complete the Problem Definition step",
              "Map all your stakeholders",
              "Build a complete Problem Tree",
              "Transform problems into objectives",
              "Create your Theory of Change",
              "Complete the Logframe Matrix",
              "Set up monitoring indicators",
              "Complete your first full program",
              "Invite team members to collaborate",
            ].map((tip, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                {tip}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
