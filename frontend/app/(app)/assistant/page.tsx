"use client"

import { useState, useRef, useEffect } from "react" // Removed React to fix conflict
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area" // Assuming it is or will be installed
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useDemoStore } from "@/lib/demo-store"
import { Send, User, Bot, Sparkles, Loader2, RefreshCw, Copy, ThumbsUp, ThumbsDown, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

type Message = {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
}

const SUGGESTED_QUESTIONS = [
    "How do I create a new project?",
    "Explain the Logical Framework Approach",
    "Help me define my project objective",
    "What templates are available?",
]

export default function AssistantPage() {
    const { user } = useDemoStore()
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: `Hello ${user?.name?.split(" ")[0] || "there"}! I'm your Shiksha Raha AI assistant. I can help you with program design, explain LFA concepts, or guide you through the platform. How can I assist you today?`,
            timestamp: new Date(),
        },
    ])
    const [inputValue, setInputValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = async (text?: string) => {
        const content = text || inputValue.trim()
        if (!content) return

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content,
            timestamp: new Date(),
        }

        // Optimistically update UI
        const newMessages = [...messages, userMessage]
        setMessages(newMessages)
        setInputValue("")
        setIsLoading(true)

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: newMessages.map(m => ({ role: m.role, content: m.content }))
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to get response")
            }

            const data = await response.json()

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.content,
                timestamp: new Date(),
            }

            setMessages((prev) => [...prev, aiMessage])

        } catch (error) {
            console.error("Chat Error:", error)
            // Add error message to chat
            const errorMessage: Message = {
                id: Date.now().toString(),
                role: "assistant",
                content: "I'm sorry, I ran into an issue connecting to the server. Please try again later.",
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] gap-4"> {/* Adjusted height to account for header/padding */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-primary" />
                        AI Assistant
                    </h1>
                    <p className="text-muted-foreground">Your intelligent partner for program design and strategy.</p>
                </div>
            </div>

            <Card className="flex-1 flex flex-col overflow-hidden border-muted/50 shadow-sm relative">
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-6 max-w-3xl mx-auto pb-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={cn(
                                    "flex gap-3",
                                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                <Avatar className={cn("h-8 w-8 mt-1", message.role === "assistant" ? "bg-primary/10" : "bg-muted")}>
                                    {message.role === "assistant" ? (
                                        <AvatarFallback className="text-primary"><Bot className="h-5 w-5" /></AvatarFallback>
                                    ) : (
                                        <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                                    )}
                                </Avatar>

                                <div className={cn(
                                    "flex flex-col gap-1 max-w-[80%]",
                                    message.role === "user" ? "items-end" : "items-start"
                                )}>
                                    {/* Name Label */}
                                    <span className="text-xs text-muted-foreground px-1">
                                        {message.role === "assistant" ? "Assistant" : "You"}
                                    </span>

                                    {/* Message Bubble */}
                                    <div
                                        className={cn(
                                            "rounded-2xl px-4 py-3 text-sm shadow-sm",
                                            message.role === "user"
                                                ? "bg-primary text-primary-foreground rounded-tr-sm"
                                                : "bg-muted/50 border border-border rounded-tl-sm"
                                        )}
                                    >
                                        <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                                    </div>

                                    {/* Action Buttons for AI */}
                                    {message.role === "assistant" && (
                                        <div className="flex items-center gap-1 mt-1 pl-1">
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                                                <RefreshCw className="h-3 w-3" />
                                            </Button>
                                            <Separator orientation="vertical" className="h-3 mx-1" />
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                                                <ThumbsUp className="h-3 w-3" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                                                <ThumbsDown className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex gap-3">
                                <Avatar className="h-8 w-8 mt-1 bg-primary/10">
                                    <AvatarFallback className="text-primary"><Bot className="h-5 w-5" /></AvatarFallback>
                                </Avatar>
                                <div className="bg-muted/50 border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                    <span className="text-sm text-muted-foreground">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>

                {/* Suggested Questions (only show if few messages) */}
                {messages.length < 3 && !isLoading && (
                    <div className="px-4 pb-2">
                        <div className="max-w-3xl mx-auto flex flex-wrap gap-2 justify-center">
                            {SUGGESTED_QUESTIONS.map((q, i) => (
                                <Button
                                    key={i}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-8 bg-background hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                                    onClick={() => handleSendMessage(q)}
                                >
                                    {q}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <div className="p-4 bg-background border-t">
                    <div className="max-w-3xl mx-auto relative flex items-center gap-2">
                        <Input
                            placeholder="Ask me anything about program design..."
                            className="pr-12 py-6 text-base rounded-full shadow-sm"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                            autoFocus
                        />
                        <Button
                            size="icon"
                            className="absolute right-1.5 h-9 w-9 rounded-full"
                            onClick={() => handleSendMessage()}
                            disabled={!inputValue.trim() || isLoading}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-[10px] text-center text-muted-foreground mt-2">
                        AI can make mistakes. Consider checking important information.
                    </p>
                </div>
            </Card>
        </div>
    )
}
