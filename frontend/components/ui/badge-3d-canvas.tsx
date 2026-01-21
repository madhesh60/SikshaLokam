"use client"

import React, { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Text, Sparkles } from "@react-three/drei"
import * as THREE from "three"
import { cn } from "@/lib/utils"

function BadgeFlipCard({ badge, isearned }: { badge: any, isearned: boolean }) {
    const groupRef = useRef<THREE.Group>(null)
    const [isFlipped, setIsFlipped] = useState(false)
    const targetRotation = useRef(0)

    const handleClick = (e: any) => {
        e.stopPropagation()
        setIsFlipped(prev => !prev)
        targetRotation.current = !isFlipped ? Math.PI : 0
    }

    useFrame((state, delta) => {
        if (!groupRef.current) return

        const step = 5 * delta
        const currentY = groupRef.current.rotation.y
        const diff = targetRotation.current - currentY

        if (Math.abs(diff) > 0.01) {
            groupRef.current.rotation.y += diff * step
        } else {
            groupRef.current.rotation.y = targetRotation.current
        }
    })

    const iconColor = isearned ? "#92400E" : "#6B7280"
    const textColor = isearned ? "#92400E" : "#6B7280"

    return (
        <group
            ref={groupRef}
            onClick={handleClick}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}
        >
            {/* Front Side: Badge with Golden Circle */}
            <group position={[0, 0, 0.1]}>
                {/* Outer Golden Ring */}
                <mesh position={[0, 0, -0.08]}>
                    <torusGeometry args={[1.4, 0.15, 16, 64]} />
                    <meshStandardMaterial
                        color={isearned ? "#F59E0B" : "#9CA3AF"}
                        emissive={isearned ? "#D97706" : "#6B7280"}
                        emissiveIntensity={0.6}
                        metalness={0.8}
                        roughness={0.2}
                    />
                </mesh>

                {/* Inner Golden Ring */}
                <mesh position={[0, 0, -0.07]}>
                    <torusGeometry args={[1.2, 0.1, 16, 64]} />
                    <meshStandardMaterial
                        color={isearned ? "#FBBF24" : "#D1D5DB"}
                        emissive={isearned ? "#F59E0B" : "#9CA3AF"}
                        emissiveIntensity={0.5}
                        metalness={0.7}
                        roughness={0.3}
                    />
                </mesh>

                {/* Center Circle Background */}
                <mesh position={[0, 0, -0.05]}>
                    <circleGeometry args={[1.15, 64]} />
                    <meshStandardMaterial
                        color={isearned ? "#FEF3C7" : "#F3F4F6"}
                        emissive={isearned ? "#FCD34D" : "#E5E7EB"}
                        emissiveIntensity={0.3}
                        metalness={0.3}
                        roughness={0.5}
                    />
                </mesh>

                {/* Icon */}
                <Text
                    fontSize={1}
                    color={iconColor}
                    anchorX="center"
                    anchorY="middle"
                    position={[0, 0, 0.02]}
                >
                    {badge.icon || "🏆"}
                    <meshStandardMaterial
                        color={iconColor}
                        roughness={0.4}
                    />
                </Text>
            </group>

            {/* Back Side: Golden Ring with Description Text Inside */}
            <group position={[0, 0, -0.1]} rotation={[0, Math.PI, 0]}>
                {/* Outer Golden Ring */}
                <mesh position={[0, 0, 0]}>
                    <torusGeometry args={[1.4, 0.15, 16, 64]} />
                    <meshStandardMaterial
                        color={isearned ? "#F59E0B" : "#9CA3AF"}
                        emissive={isearned ? "#D97706" : "#6B7280"}
                        emissiveIntensity={0.6}
                        metalness={0.8}
                        roughness={0.2}
                    />
                </mesh>

                {/* Inner Golden Ring */}
                <mesh position={[0, 0, 0.01]}>
                    <torusGeometry args={[1.2, 0.1, 16, 64]} />
                    <meshStandardMaterial
                        color={isearned ? "#FBBF24" : "#D1D5DB"}
                        emissive={isearned ? "#F59E0B" : "#9CA3AF"}
                        emissiveIntensity={0.5}
                        metalness={0.7}
                        roughness={0.3}
                    />
                </mesh>

                {/* White/Light Center Circle */}
                <mesh position={[0, 0, -0.02]}>
                    <circleGeometry args={[1.15, 64]} />
                    <meshStandardMaterial
                        color={isearned ? "#FFFFFF" : "#F9FAFB"}
                        emissive={isearned ? "#FEF3C7" : "#F3F4F6"}
                        emissiveIntensity={0.2}
                        metalness={0.1}
                        roughness={0.6}
                    />
                </mesh>

                {/* Description Text */}
                <Text
                    color={textColor}
                    fontSize={0.20}
                    maxWidth={2}
                    lineHeight={1.3}
                    textAlign="center"
                    anchorX="center"
                    anchorY="middle"
                    position={[0, 0, 0.02]}
                >
                    {badge.description}
                    <meshStandardMaterial
                        color={textColor}
                        roughness={0.5}
                    />
                </Text>
            </group>

            {/* Invisible hit box */}
            <mesh visible={false}>
                <boxGeometry args={[3.5, 3.5, 0.5]} />
                <meshBasicMaterial />
            </mesh>

            {/* Sparkles for earned badges */}
            {isearned && (
                <Sparkles
                    count={30}
                    scale={4}
                    size={3}
                    speed={0.3}
                    opacity={0.6}
                    color="#FBBF24"
                />
            )}
        </group>
    )
}

export default function Badge3DCanvas({ badge, isearned }: { badge: any, isearned: boolean }) {
    return (
        <div className="w-full flex flex-col items-center group relative">
            {/* 3D Viewer */}
            <div className="w-56 h-56 relative cursor-pointer hover:scale-105 transition-transform duration-200">
                <Canvas
                    dpr={[1, 2]}
                    camera={{ position: [0, 0, 5], fov: 50 }}
                    gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
                >
                    {/* Enhanced Lighting */}
                    <ambientLight intensity={0.9} />
                    <spotLight position={[10, 10, 10]} angle={0.4} penumbra={1} intensity={1.5} color="#FFF7ED" />
                    <spotLight position={[-10, 10, 5]} angle={0.4} penumbra={1} intensity={0.8} color="#FCD34D" />
                    <pointLight position={[0, -10, 5]} intensity={0.6} color="#F59E0B" />

                    <BadgeFlipCard
                        badge={badge}
                        isearned={isearned}
                    />
                </Canvas>
            </div>

            {/* Instruction */}
            <p className="text-[10px] text-muted-foreground mt-2 opacity-50">Click to flip</p>

            {/* Badge Label with Brown Background */}
            <div className="mt-3 text-center w-full px-4">
                <div className={cn(
                    "inline-flex items-center justify-center gap-2 px-5 py-2 rounded-md shadow-md",
                    isearned 
                        ? "bg-amber-900 text-amber-50" 
                        : "bg-gray-700 text-gray-300"
                )}>
                    {isearned && (
                        <span className="text-amber-300 text-sm font-bold">★</span>
                    )}
                    <h3 className="font-bold text-sm uppercase tracking-wide">
                        {badge.name}
                    </h3>
                    {isearned && (
                        <span className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
                            EARNED
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}