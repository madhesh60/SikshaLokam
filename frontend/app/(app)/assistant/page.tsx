"use client"

import { useState, useRef, useEffect } from "react" // Removed React to fix conflict
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area" // Assuming it is or will be installed
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useDemoStore } from "@/lib/demo-store"
import { Send, User, Bot, Sparkles, Loader2, RefreshCw, Copy, ThumbsUp, ThumbsDown, MoreHorizontal, CheckCircle2 } from "lucide-react"
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

    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
    const [dislikedIds, setDislikedIds] = useState<Set<string>>(new Set())

    const handleCopy = (content: string, id: string) => {
        navigator.clipboard.writeText(content)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const handleRegenerate = () => {
        // Find the last user message
        const lastUserMessageIndex = messages.findLastIndex(m => m.role === "user")
        if (lastUserMessageIndex === -1) return

        const lastUserMessage = messages[lastUserMessageIndex]

        // Remove everything after the last user message (including the AI response we want to regenerate)
        // If the AI response failed or is being regenerated, we want to start fresh from that user message
        const newHistory = messages.slice(0, lastUserMessageIndex)
        setMessages(newHistory)

        // Trigger send with the last user message content
        handleSendMessage(lastUserMessage.content)
    }

    const handleLike = (id: string) => {
        setLikedIds(prev => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
                // Remove from dislikes if present
                setDislikedIds(d => {
                    const newDislikes = new Set(d)
                    newDislikes.delete(id)
                    return newDislikes
                })
            }
            return next
        })
    }

    const handleDislike = (id: string) => {
        setDislikedIds(prev => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
                // Remove from likes if present
                setLikedIds(l => {
                    const newLikes = new Set(l)
                    newLikes.delete(id)
                    return newLikes
                })
            }
            return next
        })
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
                        {messages.map((message, index) => (
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
                                        <div className="text-sm leading-relaxed">
                                            <ReactMarkdown
                                                components={{
                                                    ul: ({ node, ...props }) => <ul className="list-disc pl-4 my-2 space-y-1" {...props} />,
                                                    ol: ({ node, ...props }) => <ol className="list-decimal pl-4 my-2 space-y-1" {...props} />,
                                                    li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                                    h1: ({ node, ...props }) => <h1 className="text-lg font-bold mt-4 mb-2" {...props} />,
                                                    h2: ({ node, ...props }) => <h2 className="text-base font-bold mt-3 mb-2" {...props} />,
                                                    h3: ({ node, ...props }) => <h3 className="text-sm font-bold mt-2 mb-1" {...props} />,
                                                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                    code: ({ node, className, children, ...props }: any) => {
                                                        const match = /language-(\w+)/.exec(className || '')
                                                        return (
                                                            <code className={cn("font-mono text-xs", className ? "bg-transparent text-inherit" : "bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded")} {...props}>
                                                                {children}
                                                            </code>
                                                        )
                                                    },
                                                    pre: ({ node, ...props }) => (
                                                        <div className="my-2 rounded-md overflow-hidden bg-zinc-950 dark:bg-zinc-900 border border-zinc-800 text-zinc-50">
                                                            <div className="px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-[10px] text-zinc-400 font-mono uppercase">
                                                                Code
                                                            </div>
                                                            <pre className="p-3 overflow-x-auto text-xs font-mono leading-relaxed" {...props} />
                                                        </div>
                                                    ),
                                                    blockquote: ({ node, ...props }) => (
                                                        <blockquote className="border-l-2 border-primary/50 pl-3 my-2 italic text-muted-foreground" {...props} />
                                                    ),
                                                    a: ({ node, ...props }) => (
                                                        <a className="underline hover:opacity-80 transition-opacity font-medium" target="_blank" rel="noopener noreferrer" {...props} />
                                                    )
                                                }}
                                            >
                                                {message.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>

                                    {/* Action Buttons for AI */}
                                    {message.role === "assistant" && (
                                        <div className="flex items-center gap-1 mt-1 pl-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                                onClick={() => handleCopy(message.content, message.id)}
                                            >
                                                {copiedId === message.id ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                                            </Button>

                                            {/* Only show refresh on the latest message */}
                                            {index === messages.length - 1 && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                                    onClick={handleRegenerate}
                                                    disabled={isLoading}
                                                >
                                                    <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
                                                </Button>
                                            )}

                                            <Separator orientation="vertical" className="h-3 mx-1" />

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={cn("h-6 w-6 hover:text-foreground", likedIds.has(message.id) ? "text-primary" : "text-muted-foreground")}
                                                onClick={() => handleLike(message.id)}
                                            >
                                                <ThumbsUp className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={cn("h-6 w-6 hover:text-foreground", dislikedIds.has(message.id) ? "text-destructive" : "text-muted-foreground")}
                                                onClick={() => handleDislike(message.id)}
                                            >
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
