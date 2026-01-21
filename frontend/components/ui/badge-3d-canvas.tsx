"use client"

import React, { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Html, OrbitControls, useTexture, Text, Float, Center, ContactShadows } from "@react-three/drei"
import * as THREE from "three"
import { cn } from "@/lib/utils"
import { Lock, Star } from "lucide-react"

// Material properties for different states
const MATERIALS = {
    earned: {
        color: "#FFD700", // Gold
        metalness: 0.8,
        roughness: 0.2,
        envMapIntensity: 1,
    },
    locked: {
        color: "#777777", // Grey Stone
        metalness: 0.1,
        roughness: 0.8,
        envMapIntensity: 0.5,
    }
}

interface Badge3DModelProps {
    badge: {
        id: string
        name: string
        description: string
        icon: any // Lucide Icon Component
    }
    isearned: boolean
}

function Coin({ badge, isearned }: Badge3DModelProps) {
    const meshRef = useRef<THREE.Group>(null)

    // Continuous localized rotation if not interacting
    useFrame((state, delta) => {
        if (meshRef.current) {
            // Slow gentle idle rotation
            meshRef.current.rotation.y += delta * 0.2
        }
    })

    const materialProps = isearned ? MATERIALS.earned : MATERIALS.locked

    return (
        <group ref={meshRef}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                {/* The Coin Body */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[2.8, 2.8, 0.3, 64]} />
                    <meshStandardMaterial
                        {...materialProps}
                        emissive={isearned ? "#553300" : "#000000"}
                        emissiveIntensity={0.2}
                    />
                </mesh>

                {/* Rim Details (Torus) */}
                <mesh rotation={[0, 0, 0]}>
                    <torusGeometry args={[2.8, 0.1, 16, 64]} />
                    <meshStandardMaterial {...materialProps} color={isearned ? "#FFAA00" : "#555555"} />
                </mesh>

                {/* Inner Recessed Face for Icon */}
                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.16]}>
                    <cylinderGeometry args={[2.4, 2.4, 0.05, 32]} />
                    <meshStandardMaterial {...materialProps} color={isearned ? "#FFFACD" : "#666666"} roughness={0.4} />
                </mesh>
                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.16]}>
                    <cylinderGeometry args={[2.4, 2.4, 0.05, 32]} />
                    <meshStandardMaterial {...materialProps} color={isearned ? "#FFFACD" : "#666666"} roughness={0.4} />
                </mesh>

                {/* Floating HTML Icon on Front Face */}
                <Html transform position={[0, 0, 0.2]} occlude style={{ pointerEvents: "none" }}>
                    <div className={cn(
                        "flex items-center justify-center p-2 rounded-full",
                        isearned ? "text-yellow-700 dropping-shadow-md" : "text-gray-400 grayscale"
                    )}>
                        {/* Scale the lucide icon up */}
                        <div style={{ transform: 'scale(4)' }}>
                            {badge.icon}
                        </div>
                    </div>
                </Html>

                {/* Text on Back Face */}
                <Html transform position={[0, 0, -0.2]} rotation={[0, Math.PI, 0]} occlude style={{ pointerEvents: "none" }}>
                    <div className={cn(
                        "w-32 text-center select-none bg-white/90 p-2 rounded-lg shadow-xl",
                        isearned ? "text-yellow-900 border border-yellow-500" : "text-gray-800 border border-gray-400"
                    )}>
                        <div className="font-bold text-sm mb-1">{badge.name}</div>
                        <div className="text-[8px] leading-tight">{badge.description}</div>
                    </div>
                </Html>
            </Float>
        </group>
    )
}

export function Badge3DCanvas(props: Badge3DModelProps) {
    return (
        <div className="w-full h-64 relative">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
                <ambientLight intensity={props.isearned ? 0.8 : 0.4} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                <Coin {...props} />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI - Math.PI / 4}
                />
                <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4} />
            </Canvas>

            {/* HTML Checkmark/Lock Overlay (Static UI) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
                {props.isearned ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/90 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg backdrop-blur-sm">
                        <Star className="w-3 h-3 fill-white" /> Earned
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg backdrop-blur-sm">
                        <Lock className="w-3 h-3" /> Locked
                    </div>
                )}
            </div>
        </div>
    )
}
