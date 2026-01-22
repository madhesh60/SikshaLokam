"use client"

import { useState } from "react"
import { useDemoStore, Comment, TeamMember } from "@/lib/demo-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, Users, Send, Clock, CheckCircle2, AlertCircle } from "lucide-react"

interface CollaborationPanelProps {
    projectId: string
    currentStep: number
}

export function CollaborationPanel({ projectId, currentStep }: CollaborationPanelProps) {
    const { projects, user, addComment, inviteTeamMember, updateProject } = useDemoStore()
    const project = projects.find(p => p.id === projectId)

    const [newComment, setNewComment] = useState("")
    const [inviteEmail, setInviteEmail] = useState("")

    if (!project || !user) return null

    const handleSendComment = () => {
        if (!newComment.trim()) return
        addComment(projectId, {
            text: newComment,
            stepId: currentStep,
            userAvatar: user.avatar
        })
        setNewComment("")
    }

    const handleInvite = () => {
        if (!inviteEmail.trim()) return
        inviteTeamMember(projectId, inviteEmail, "editor")
        setInviteEmail("")
    }

    const handleStatusChange = (status: "draft" | "review" | "in-progress" | "completed") => {
        updateProject(projectId, { status })
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 border-primary/20 text-primary hover:bg-primary/5">
                    <MessageSquare className="h-4 w-4" />
                    Collaboration
                    {(project.comments?.length || 0) > 0 && (
                        <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]">
                            {project.comments?.length}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[450px] flex flex-col h-full">
                <SheetHeader>
                    <SheetTitle className="flex items-center justify-between">
                        <span>Project Collaboration</span>
                        <Badge variant="outline" className="capitalize">{project.status}</Badge>
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 flex flex-col gap-6 mt-6 overflow-hidden">

                    {/* Status Workflow */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4" />
                            Workflow Status
                        </h3>
                        <div className="p-3 bg-muted/40 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Current Stage</span>
                                <Select value={project.status} onValueChange={(val: any) => handleStatusChange(val)}>
                                    <SelectTrigger className="w-[140px] h-8 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                        <SelectItem value="review">In Review</SelectItem>
                                        <SelectItem value="completed">Approved</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {project.status === 'review'
                                    ? "This project is currently locked for review by stakeholders."
                                    : "Move to 'Review' when you are ready for feedback."}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Team Members */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            Team Access
                        </h3>
                        <div className="flex gap-2">
                            <Input
                                placeholder="colleague@org.com"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                className="h-8 text-sm"
                            />
                            <Button size="sm" onClick={handleInvite} className="h-8">Invite</Button>
                        </div>
                        <div className="space-y-2 mt-2">
                            {(project.team || []).map(member => (
                                <div key={member.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={member.avatar} />
                                            <AvatarFallback className="text-[10px]">{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium leading-none">{member.name}</span>
                                            <span className="text-[10px] text-muted-foreground">{member.role}</span>
                                        </div>
                                    </div>
                                    {member.status === 'pending' && <Badge variant="outline" className="text-[10px] h-4">Pending</Badge>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Comments */}
                    <div className="flex-1 flex flex-col min-h-0">
                        <h3 className="text-sm font-medium flex items-center gap-2 text-muted-foreground mb-3">
                            <MessageSquare className="h-4 w-4" />
                            Discussion
                        </h3>
                        <ScrollArea className="flex-1 pr-4 -mr-4">
                            <div className="space-y-4">
                                {(project.comments || []).length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground text-sm">
                                        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                        No comments yet. Start the discussion!
                                    </div>
                                ) : (
                                    [...(project.comments || [])].reverse().map(comment => (
                                        <div key={comment.id} className="flex gap-3 text-sm">
                                            <Avatar className="h-8 w-8 mt-0.5 border">
                                                <AvatarImage src={comment.userAvatar} />
                                                <AvatarFallback>{comment.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-xs">{comment.userName}</span>
                                                    <span className="text-[10px] text-muted-foreground">{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    {comment.stepId && <Badge variant="secondary" className="text-[9px] h-4 px-1">Step {comment.stepId}</Badge>}
                                                </div>
                                                <p className="text-muted-foreground bg-muted/40 p-2 rounded-md rounded-tl-none">
                                                    {comment.text}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>

                        <div className="pt-4 flex gap-2">
                            <Input
                                placeholder="Type a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                            />
                            <Button size="icon" onClick={handleSendComment}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
