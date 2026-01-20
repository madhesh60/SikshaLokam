"use client"

import * as React from "react"
import { Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { cn } from "@/lib/utils"

interface MicButtonProps {
    onTranscript: (text: string) => void
    className?: string
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon"
}

export function MicButton({
    onTranscript,
    className,
    variant = "ghost",
    size = "icon",
}: MicButtonProps) {
    const { isListening, startListening, stopListening, hasSupport, error } = useSpeechRecognition({
        onResult: (text) => {
            onTranscript(text)
        },
    })

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault() // Prevent form submission if inside a form
        if (isListening) {
            stopListening()
        } else {
            startListening()
        }
    }

    if (!hasSupport) return null

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        variant={isListening ? "destructive" : variant}
                        size={size}
                        className={cn(
                            "transition-all duration-200 shrink-0",
                            isListening && "animate-pulse ring-2 ring-destructive/50",
                            className
                        )}
                        onClick={handleClick}
                        aria-label={isListening ? "Stop listening" : "Start voice input"}
                    >
                        <Mic className={cn("h-4 w-4", isListening ? "text-destructive-foreground" : "text-muted-foreground")} />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                    <p>{error ? "Error: " + error : isListening ? "Listening..." : "Click to speak"}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
