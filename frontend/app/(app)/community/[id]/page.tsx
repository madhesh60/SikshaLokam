"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronLeft, ThumbsUp, MessageSquare, Share2, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useDemoStore } from "@/lib/demo-store"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export default function DiscussionDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { discussions, addDiscussionReply } = useDemoStore()
    const id = params.id as string

    const discussion = discussions.find((d) => d.id === id)
    const [replyText, setReplyText] = useState("")

    if (!discussion) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <h1 className="text-2xl font-bold">Discussion not found</h1>
                <Button onClick={() => router.push("/community")}>Back to Community</Button>
            </div>
        )
    }

    const handlePostReply = () => {
        if (!replyText.trim()) return
        addDiscussionReply(id, replyText)
        setReplyText("")
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-700 pb-20">

            {/* Navigation */}
            <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <ChevronLeft className="h-4 w-4" />
                <Link href="/community" className="text-sm font-medium">Back to Community</Link>
            </div>

            {/* Main Discussion Post */}
            <Card className="border-primary/20 shadow-sm">
                <CardContent className="p-8 space-y-6">

                    {/* Header: Author & Meta */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border-2 border-primary/10">
                                <AvatarFallback className="bg-primary/10 text-primary font-bold">{discussion.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-semibold text-foreground text-lg">{discussion.author}</h3>
                                <p className="text-sm text-muted-foreground">{discussion.timestamp} • {discussion.category}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">{discussion.title}</h1>
                        <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                            <p>{discussion.content}</p>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {discussion.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="px-3 py-1 bg-secondary/50 hover:bg-secondary">#{tag}</Badge>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-border/50">
                        <div className="flex gap-4">
                            <Button variant="outline" className="gap-2 rounded-full">
                                <ThumbsUp className="h-4 w-4" />
                                {discussion.likes} Likes
                            </Button>
                            <Button variant="outline" className="gap-2 rounded-full">
                                <MessageSquare className="h-4 w-4" />
                                {discussion.replies} Replies
                            </Button>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-2">
                            <Share2 className="h-4 w-4" /> Share
                        </Button>
                    </div>

                </CardContent>
            </Card>

            {/* Reply Section */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold px-1">Responses ({discussion.replies || 0})</h3>

                {/* Replies List */}
                <div className="space-y-4">
                    {discussion.repliesList?.map((reply) => (
                        <Card key={reply.id} className="bg-muted/30 border-none">
                            <CardContent className="p-4 flex gap-4">
                                <Avatar className="h-8 w-8 mt-1">
                                    <AvatarFallback className="bg-primary/10 text-primary text-xs">{reply.avatar}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm">{reply.author}</span>
                                        <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                                    </div>
                                    <p className="text-sm text-foreground/90">{reply.content}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Post Reply Box */}
                <div className="flex gap-4 pt-4 border-t border-border">
                    <Avatar className="h-10 w-10 mt-1">
                        <AvatarFallback className="bg-muted">You</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-4">
                        <Textarea
                            placeholder="Share your thoughts or answer..."
                            className="min-h-[120px] bg-background"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <Button onClick={handlePostReply} disabled={!replyText.trim()}>Post Reply</Button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
