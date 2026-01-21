"use client"

import React, { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Lock, Star } from "lucide-react"

interface Badge3DProps {
    badge: {
        id: string
        name: string
        description: string
        icon: string
    }
    isearned: boolean
}

export function Badge3D({ badge, isearned }: Badge3DProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const glareRef = useRef<HTMLDivElement>(null)
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current || !glareRef.current) return

        const card = cardRef.current
        const rect = card.getBoundingClientRect()

        // Calculate mouse position relative to card center
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2

        // Calculate rotation (max 20 degrees)
        const rotateX = (y / (rect.height / 2)) * -20
        const rotateY = (x / (rect.width / 2)) * 20

        // Apply rotation
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.1, 1.1, 1.1)`

        // Calculate glare position
        const glareX = 50 + (x / rect.width) * 100
        const glareY = 50 + (y / rect.height) * 100
        glareRef.current.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 80%)`
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
        if (cardRef.current && glareRef.current) {
            cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
            glareRef.current.style.background = `radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 80%)`
        }
    }

    return (
        <div className="relative group perspective-1000 w-56 h-64 p-4">
            <div
                ref={cardRef}
                className={cn(
                    "relative w-full h-full transition-transform duration-200 ease-out transform-style-3d cursor-pointer select-none",
                )}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
            >
                {/* Shadow/Depth Layer behind the coin */}
                <div className="absolute inset-0 rounded-[2rem] bg-black/40 blur-xl translate-z-[-20px] transition-opacity duration-300"
                    style={{ opacity: isHovered ? 0.6 : 0.3 }} />

                {/* Main Card Contianer - The "Tablet" or "Card" holding the medal */}
                <div className={cn(
                    "absolute inset-0 rounded-[2rem] border-2 flex flex-col items-center p-4 overflow-hidden backface-hidden",
                    isearned
                        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                        : "bg-slate-900/90 border-slate-700 shadow-inner"
                )}>
                    {/* Background Texture/Grid */}
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                    {/* The "Medal" itself */}
                    <div className={cn(
                        "relative w-32 h-32 rounded-full flex items-center justify-center mb-4 transition-all duration-300 transform-style-3d",
                        "shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]",
                        isearned ? "shadow-yellow-500/20" : "grayscale opacity-70"
                    )}
                        style={{ transform: "translateZ(30px)" }}
                    >
                        {/* Medal Rim */}
                        <div className={cn(
                            "absolute inset-0 rounded-full border-[6px]",
                            isearned
                                ? "border-yellow-600 bg-gradient-to-br from-yellow-300 via-yellow-600 to-yellow-800"
                                : "border-slate-600 bg-gradient-to-br from-slate-400 via-slate-600 to-slate-700"
                        )} />

                        {/* Medal Inner Face */}
                        <div className={cn(
                            "absolute inset-[6px] rounded-full flex items-center justify-center",
                            isearned
                                ? "bg-gradient-to-br from-yellow-100 via-yellow-400 to-yellow-600"
                                : "bg-gradient-to-br from-slate-200 via-slate-400 to-slate-600"
                        )}>
                            {/* Icon floating above face */}
                            <div className="text-5xl drop-shadow-lg transform transition-transform"
                                style={{ transform: "translateZ(20px)" }}>
                                {badge.icon}
                            </div>
                        </div>

                        {/* Shine on Medal */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 animate-[spin_4s_linear_infinite]"
                            style={{ opacity: isearned ? 0.3 : 0 }} />
                    </div>

                    {/* Text Info */}
                    <div className="relative z-10 text-center" style={{ transform: "translateZ(20px)" }}>
                        <h3 className={cn(
                            "font-bold text-lg mb-1 tracking-tight",
                            isearned ? "text-yellow-100 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]" : "text-slate-400"
                        )}>
                            {badge.name}
                        </h3>
                        <p className="text-[10px] leading-tight text-slate-400 font-medium px-2 line-clamp-2">
                            {badge.description}
                        </p>
                    </div>

                    {/* Status Pill */}
                    <div className="absolute bottom-4" style={{ transform: "translateZ(15px)" }}>
                        {isearned ? (
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 text-[10px] font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                                <Star className="w-3 h-3 fill-yellow-300" /> Earned
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-600 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                                <Lock className="w-3 h-3" /> Locked
                            </div>
                        )}
                    </div>

                    {/* Glare/Sheen Overlay */}
                    <div
                        ref={glareRef}
                        className="absolute inset-0 rounded-[2rem] pointer-events-none mix-blend-overlay opacity-0 transition-opacity duration-300"
                        style={{ opacity: isHovered ? 0.7 : 0 }}
                    />
                </div>
            </div>
        </div>
    )
}
