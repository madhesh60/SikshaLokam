"use client"

import dynamic from "next/dynamic"
import React, { useState } from "react"
import { Badge3DStatic } from "./badge-3d-static"

// Dynamically import the 3D canvas (no SSR for three.js)
// We only load this when the user interacts, saving resources
const Badge3DCanvas = dynamic(() => import("./badge-3d-canvas").then((mod) => mod.Badge3DCanvas), {
    ssr: false,
    loading: () => null, // The Static badge is already visible during load time technically, or we can show a spinner
})

interface Badge3DProps {
    badge: {
        id: string
        name: string
        description: string
        icon: any
    }
    isearned: boolean
}

export function Badge3D(props: Badge3DProps) {
    const [isInteractive, setIsInteractive] = useState(false)

    if (isInteractive) {
        return (
            <div className="relative w-56 h-64">
                {/* Fallback to static if canvas fails or while loading? 
               Dynamic import handles loading, but we can wrap in Suspense boundary if needed. 
               For now, next/dynamic loading prop handles it. 
           */}
                <Badge3DCanvas {...props} />

                {/* Close button to return to static state? Optional. */}
            </div>
        )
    }

    return (
        <Badge3DStatic
            {...props}
            onClick={() => setIsInteractive(true)}
        />
    )
}
