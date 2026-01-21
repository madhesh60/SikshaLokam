"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Lock, Star } from "lucide-react"

interface Badge3DProps {
    badge: {
        id: string
        name: string
        description: string
        icon: any
    }
    isearned: boolean
    onClick?: () => void
}

export function Badge3DStatic({ badge, isearned, onClick }: Badge3DProps) {
    return (
        <div
            onClick={onClick}
            className="group relative w-56 h-64 p-4 cursor-pointer transition-transform hover:scale-105"
        >
            <div className="relative w-full h-full flex flex-col items-center justify-center">

                {/* Shadow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-black/20 blur-xl" />

                {/* The Coin */}
                <div className={cn(
                    "relative w-40 h-40 rounded-full flex items-center justify-center shadow-xl border-[6px]",
                    isearned
                        ? "bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 border-amber-600 shadow-amber-500/20"
                        : "bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 border-slate-600 grayscale opacity-80"
                )}>

                    {/* Inner Bevel */}
                    <div className={cn(
                        "absolute inset-1 rounded-full border-[4px] opacity-50",
                        isearned ? "border-amber-200" : "border-slate-200"
                    )} />

                    {/* Inner Face */}
                    <div className={cn(
                        "absolute inset-3 rounded-full flex items-center justify-center shadow-inner",
                        isearned
                            ? "bg-gradient-to-tr from-amber-100 to-amber-400"
                            : "bg-gradient-to-tr from-slate-100 to-slate-300"
                    )}>
                        {/* Icon */}
                        <div className="text-6xl drop-shadow-md transform transition-transform group-hover:scale-110">
                            {badge.icon}
                        </div>
                    </div>

                    {/* Shine Overlay */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>

                {/* Text Plate */}
                <div className={cn(
                    "absolute bottom-4 w-40 text-center py-2 px-1 rounded-lg backdrop-blur-md border shadow-lg transform translate-y-2 opacity-90 transition-all group-hover:translate-y-0 group-hover:opacity-100",
                    isearned
                        ? "bg-amber-950/80 border-amber-500/30 text-amber-50"
                        : "bg-slate-900/80 border-slate-700/50 text-slate-300"
                )}>
                    <h3 className="text-sm font-bold truncate leading-tight">{badge.name}</h3>

                    {isearned ? (
                        <div className="mt-1 flex items-center justify-center gap-1 text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                            <Star className="w-2.5 h-2.5 fill-amber-300" /> Earned
                        </div>
                    ) : (
                        <div className="mt-1 flex items-center justify-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <Lock className="w-2.5 h-2.5" /> Locked
                        </div>
                    )}
                </div>

                {/* Click Prompt */}
                <div className="absolute -bottom-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-muted-foreground font-medium">
                    Click to interact
                </div>
            </div>
        </div>
    )
}
