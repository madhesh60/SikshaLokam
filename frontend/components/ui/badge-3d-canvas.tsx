"use client"

import React, { useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Html, OrbitControls, Environment, Sparkles, Float, ContactShadows } from "@react-three/drei"
import * as THREE from "three"
import { cn } from "@/lib/utils"
import { Lock, Star } from "lucide-react"

const GOLD_COLOR = "#FFD700"
const LOCKED_COLOR = "#718096"

function Coin({ badge, isearned, isAnimating, onAnimationComplete }: { 
    badge: any, 
    isearned: boolean,
    isAnimating: boolean,
    onAnimationComplete: () => void
}) {
    const meshRef = useRef<THREE.Group>(null)
    const animationStartTime = useRef<number | null>(null)

    useFrame((state) => {
        if (!meshRef.current) return;

        if (isAnimating) {
            if (animationStartTime.current === null) {
                animationStartTime.current = state.clock.elapsedTime;
            }

            const elapsed = state.clock.elapsedTime - animationStartTime.current;
            const duration = 1.5; // LeetCode-style quick spin

            if (elapsed < duration) {
                // Smooth ease-out animation with multiple rotations
                const t = elapsed / duration;
                const easeOut = 1 - Math.pow(1 - t, 3);
                
                // 3 full rotations (6 * PI)
                meshRef.current.rotation.y = Math.PI * 6 * easeOut;
            } else {
                // Animation complete - reset to static position
                meshRef.current.rotation.y = 0;
                animationStartTime.current = null;
                onAnimationComplete();
            }
        } else {
            // Static - no rotation
            meshRef.current.rotation.y = 0;
            animationStartTime.current = null;
        }
    })

    // High-Quality PBR Material
    const materialProps = {
        color: isearned ? GOLD_COLOR : LOCKED_COLOR,
        metalness: isearned ? 1.0 : 0.8,
        roughness: isearned ? 0.15 : 0.4,
        clearcoat: isearned ? 1.0 : 0,
        clearcoatRoughness: 0.1,
        envMapIntensity: isearned ? 2 : 1,
    }

    return (
        <group ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
            {/* Coin Body - Increased Segments for Smoothness */}
            <mesh>
                <cylinderGeometry args={[2.5, 2.5, 0.4, 128]} />
                <meshPhysicalMaterial {...materialProps} />
            </mesh>

            {/* Rim */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[2.5, 0.15, 16, 128]} />
                <meshPhysicalMaterial {...materialProps} color={isearned ? "#F6E05E" : "#A0AEC0"} />
            </mesh>

            {/* Front Inset */}
            <mesh position={[0, 0.21, 0]}>
                <cylinderGeometry args={[2.2, 2.2, 0.05, 128]} />
                <meshPhysicalMaterial {...materialProps} color={isearned ? "#FEFCBF" : "#E2E8F0"} roughness={0.3} />
            </mesh>

            {/* Back Inset */}
            <mesh position={[0, -0.21, 0]}>
                <cylinderGeometry args={[2.2, 2.2, 0.05, 128]} />
                <meshPhysicalMaterial {...materialProps} color={isearned ? "#FEFCBF" : "#E2E8F0"} roughness={0.3} />
            </mesh>

            {/* Icon on Front */}
            <Html
                transform
                occlude="blending"
                position={[0, 0.26, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}
            >
                <div className={cn("transform scale-[3] drop-shadow-2xl", isearned ? "text-yellow-800" : "text-slate-500 grayscale")}>
                    {/* We assume badge.icon is an emoji/string. To make it 'real', we add shadows and filters */}
                    {badge.icon}
                </div>
            </Html>

            {/* Sparkles for earned */}
            {isearned && (
                <Sparkles count={35} scale={5} size={6} speed={0.4} opacity={0.8} color="#FFFFE0" position={[0, 0, 0]} />
            )}
        </group>
    )
}

export default function Badge3DCanvas({ badge, isearned }: { badge: any, isearned: boolean }) {
    const [isAnimating, setIsAnimating] = React.useState(false)

    const handleClick = () => {
        if (!isAnimating) {
            setIsAnimating(true)
        }
    }

    const handleAnimationComplete = () => {
        setIsAnimating(false)
    }

    return (
        <div className="w-full flex flex-col items-center group animate-in fade-in zoom-in duration-500">
            {/* 3D Viewer */}
            <div 
                className="w-56 h-56 relative cursor-pointer active:scale-95 transition-transform"
                onClick={handleClick}
            >
                <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 50 }}>
                    <ambientLight intensity={0.5} />
                    {/* Enhanced Lighting */}
                    <spotLight position={[10, 10, 10]} angle={0.25} penumbra={1} intensity={2} castShadow color="white" />
                    <spotLight position={[-10, 5, 10]} angle={0.25} penumbra={1} intensity={1} color="#FFD700" />
                    <Environment preset={isearned ? "city" : "studio"} />

                    <Float speed={1.5} rotationIntensity={0} floatIntensity={0.2} enabled={!isAnimating}>
                        <Coin 
                            badge={badge} 
                            isearned={isearned} 
                            isAnimating={isAnimating}
                            onAnimationComplete={handleAnimationComplete}
                        />
                    </Float>

                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        autoRotate={false}
                        enabled={!isAnimating}
                        minPolarAngle={Math.PI / 4}
                        maxPolarAngle={Math.PI - Math.PI / 4}
                    />
                    <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2.0} far={4} />
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