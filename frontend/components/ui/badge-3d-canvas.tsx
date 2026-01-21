"use client"

import React, { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Html, OrbitControls, Environment, Sparkles, Float, ContactShadows } from "@react-three/drei"
import * as THREE from "three"
import { cn } from "@/lib/utils"
import { Lock, Star } from "lucide-react"

const GOLD_COLOR = "#FFD700"
const LOCKED_COLOR = "#718096"

function Coin({ badge, isearned }: { badge: any, isearned: boolean }) {
    const meshRef = useRef<THREE.Group>(null)

    // Gentle idle animation
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
        }
    })

    // Simple clean metal coin
    const materialProps = {
        color: isearned ? GOLD_COLOR : LOCKED_COLOR,
        metalness: 1,
        roughness: 0.3,
        envMapIntensity: 1.2,
    }

    return (
        <group ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
            {/* Coin Body */}
            <mesh>
                <cylinderGeometry args={[2.5, 2.5, 0.4, 64]} />
                <meshStandardMaterial {...materialProps} />
            </mesh>

            {/* Rim */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[2.5, 0.15, 16, 64]} />
                <meshStandardMaterial {...materialProps} color={isearned ? "#F6E05E" : "#A0AEC0"} />
            </mesh>

            {/* Front Inset */}
            <mesh position={[0, 0.21, 0]}>
                <cylinderGeometry args={[2.2, 2.2, 0.05, 64]} />
                <meshStandardMaterial {...materialProps} color={isearned ? "#FEFCBF" : "#E2E8F0"} roughness={0.4} />
            </mesh>

            {/* Back Inset */}
            <mesh position={[0, -0.21, 0]}>
                <cylinderGeometry args={[2.2, 2.2, 0.05, 64]} />
                <meshStandardMaterial {...materialProps} color={isearned ? "#FEFCBF" : "#E2E8F0"} roughness={0.4} />
            </mesh>

            {/* Icon on Front */}
            <Html
                transform
                occlude="blending"
                position={[0, 0.26, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}
            >
                <div className={cn("transform scale-[3]", isearned ? "text-yellow-700" : "text-slate-400 grayscale")}>
                    {badge.icon}
                </div>
            </Html>

            {/* Sparkles for earned */}
            {isearned && (
                <Sparkles count={20} scale={4} size={4} speed={0.4} opacity={0.6} color="#FFFFE0" position={[0, 0, 0]} />
            )}
        </group>
    )
}

export function Badge3DCanvas({ badge, isearned }: { badge: any, isearned: boolean }) {
    return (
        <div className="w-full flex flex-col items-center group">
            {/* 3D Viewer */}
            <div className="w-56 h-56 relative cursor-grab active:cursor-grabbing">
                <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 50 }}>
                    <ambientLight intensity={0.7} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                    <Environment preset={isearned ? "city" : "studio"} />

                    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                        <Coin badge={badge} isearned={isearned} />
                    </Float>

                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        autoRotate={true}
                        autoRotateSpeed={2}
                        minPolarAngle={Math.PI / 4}
                        maxPolarAngle={Math.PI - Math.PI / 4}
                    />
                    <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
                </Canvas>
            </div>

            {/* HTML Info Card (Below the 3D Model) */}
            <div className="mt-2 text-center z-10 w-full px-2">
                <h3 className={cn(
                    "font-bold text-lg",
                    isearned ? "text-yellow-600 drop-shadow-sm" : "text-muted-foreground"
                )}>
                    {badge.name}
                </h3>
                <p className="text-xs text-muted-foreground mx-auto line-clamp-2 h-8">
                    {badge.description}
                </p>

                <div className="mt-2 flex justify-center">
                    {isearned ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase tracking-wider border border-yellow-200 shadow-sm">
                            <Star className="w-3 h-3 fill-yellow-700" /> Earned
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                            <Lock className="w-3 h-3" /> Locked
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
