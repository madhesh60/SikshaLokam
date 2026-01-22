"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    MessageSquare,
    Search,
    TrendingUp,
    Users,
    Plus,
    Filter,
    ThumbsUp,
    MessageCircle,
    MoreHorizontal
} from "lucide-react"
import { useState } from "react"
import { useDemoStore, Discussion } from "@/lib/demo-store"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CommunityPage() {
    const { discussions, addDiscussion, user } = useDemoStore() // Assuming user is available in store
    const [activeTab, setActiveTab] = useState("All")
    const [searchQuery, setSearchQuery] = useState("")
    const [filterMode, setFilterMode] = useState<"Recent" | "Popular" | "NoReplies">("Recent")
    const [isMyDiscussionsMode, setIsMyDiscussionsMode] = useState(false)

    // Form State
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newTitle, setNewTitle] = useState("")
    const [newCategory, setNewCategory] = useState<Discussion["category"]>("General")
    const [newContent, setNewContent] = useState("")
    const [newTags, setNewTags] = useState("")

    const router = useRouter()

    const handleCreateDiscussion = () => {
        if (!newTitle || !newContent) return

        addDiscussion({
            title: newTitle,
            content: newContent,
            category: newCategory,
            tags: newTags.split(",").map(t => t.trim()).filter(Boolean)
        })

        // Reset and Close
        setNewTitle("")
        setNewCategory("General")
        setNewContent("")
        setNewTags("")
        setIsDialogOpen(false)
    }

    const handleParticipate = () => {
        setNewTitle("Weekly Challenge: Stakeholder Mapping")
        setNewCategory("Best Practices")
        setNewTags("WeeklyChallenge, Stakeholders")
        setIsDialogOpen(true)
    }

    // Filter Logic
    let filteredDiscussions = discussions.filter(d => {
        const matchesTab = activeTab === "All" || d.category === activeTab || (activeTab === "Best" && d.category === "Best Practices") || (activeTab === "Support" && d.category === "Support")
        const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.content?.toLowerCase().includes(searchQuery.toLowerCase())

        // My Discussions Filter
        const matchesOwner = isMyDiscussionsMode ? (d.author === user?.name || d.author === "Guest User" /* Fallback for demo */) : true

        return matchesTab && matchesSearch && matchesOwner
    })

    // Sorting/Extra Filtering
    if (filterMode === "Popular") {
        filteredDiscussions.sort((a, b) => b.likes - a.likes)
    } else if (filterMode === "NoReplies") {
        filteredDiscussions = filteredDiscussions.filter(d => d.replies === 0)
    }
    // Default is "Recent", assuming array order is recent-first or has timestamp. Demo data is newest first.

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
                        Community Forum
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Connect, share, and learn from other development practitioners.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant={isMyDiscussionsMode ? "secondary" : "outline"}
                        className="hidden md:flex transition-colors"
                        onClick={() => setIsMyDiscussionsMode(!isMyDiscussionsMode)}
                    >
                        <Users className="mr-2 h-4 w-4" />
                        {isMyDiscussionsMode ? "All Discussions" : "My Discussions"}
                    </Button>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                                <Plus className="mr-2 h-4 w-4" />
                                New Discussion
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Start a New Discussion</DialogTitle>
                                <DialogDescription>
                                    Ask a question or share insights with the community.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g., Best practices for stakeholder mapping..."
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select value={newCategory} onValueChange={(v: any) => setNewCategory(v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="General">General</SelectItem>
                                            <SelectItem value="Best Practices">Best Practices</SelectItem>
                                            <SelectItem value="Support">Methodology Support</SelectItem>
                                            <SelectItem value="Resource Sharing">Resource Sharing</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="content">Content</Label>
                                    <Textarea
                                        id="content"
                                        placeholder="Describe your question or topic in detail..."
                                        className="min-h-[100px]"
                                        value={newContent}
                                        onChange={(e) => setNewContent(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="tags">Tags (comma separated)</Label>
                                    <Input
                                        id="tags"
                                        placeholder="e.g., LFA, Indicators, Risk"
                                        value={newTags}
                                        onChange={(e) => setNewTags(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreateDiscussion} disabled={!newTitle || !newContent}>Post Discussion</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Search & Stats */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search discussions, topics, or questions..."
                            className="pl-10 h-10 bg-background/50 border-input/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-primary/5 border-primary/10">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-primary">1.2k</div>
                                <div className="text-xs text-muted-foreground">Members</div>
                            </div>
                            <Users className="h-5 w-5 text-primary/40" />
                        </CardContent>
                    </Card>
                    <Card className="bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/20">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">450+</div>
                                <div className="text-xs text-muted-foreground">Solutions</div>
                            </div>
                            <MessageSquare className="h-5 w-5 text-indigo-600/40" />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid gap-8 lg:grid-cols-4">

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="space-y-1">
                        <Button variant={activeTab === "All" ? "secondary" : "ghost"} className="w-full justify-start font-medium" onClick={() => setActiveTab("All")}>
                            <TrendingUp className="mr-2 h-4 w-4" /> All Discussions
                        </Button>
                        <Button variant={activeTab === "Best" ? "secondary" : "ghost"} className="w-full justify-start font-medium text-muted-foreground" onClick={() => setActiveTab("Best")}>
                            <Users className="mr-2 h-4 w-4" /> Best Practices
                        </Button>
                        <Button variant={activeTab === "Support" ? "secondary" : "ghost"} className="w-full justify-start font-medium text-muted-foreground" onClick={() => setActiveTab("Support")}>
                            <MessageCircle className="mr-2 h-4 w-4" /> Methodology Support
                        </Button>
                    </div>

                    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/10 border-amber-200/50">
                        <CardHeader>
                            <CardTitle className="text-sm">Weekly Challenge</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Share your best stakeholder mapping technique for remote communities!
                            </p>
                            <Button onClick={handleParticipate} size="sm" variant="outline" className="w-full border-amber-300 text-amber-700 hover:bg-amber-100">Participate</Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Discussion List */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-border/50">
                        <h2 className="text-lg font-semibold">
                            {isMyDiscussionsMode ? "My Discussions" : "Latest Discussions"}
                        </h2>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-muted-foreground">
                                    <Filter className="mr-2 h-3 w-3" /> Filter: {filterMode}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setFilterMode("Recent")}>Most Recent</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFilterMode("Popular")}>Most Popular</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFilterMode("NoReplies")}>Unanswered</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>

                    {filteredDiscussions.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl">
                            <p>No discussions found matching your search.</p>
                            {isMyDiscussionsMode && <p className="text-sm mt-2">You haven't posted any discussions yet.</p>}
                        </div>
                    ) : (
                        filteredDiscussions.map((topic) => (
                            // Link to detail page
                            <Link href={`/community/${topic.id}`} key={topic.id} className="block">
                                <Card className="hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group">
                                    <CardContent className="p-6">
                                        <div className="flex gap-4">
                                            <div className="flex flex-col items-center gap-1 text-muted-foreground min-w-[3rem]">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-emerald-600">
                                                    <ThumbsUp className="h-4 w-4" />
                                                </Button>
                                                <span className="text-sm font-semibold text-emerald-600/80">{topic.likes}</span>
                                            </div>

                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant="secondary" className="text-[10px] font-normal">{topic.category}</Badge>
                                                    <span className="text-xs text-muted-foreground">Posted by {topic.author} • {topic.timestamp}</span>
                                                </div>
                                                <h3 className="text-lg font-semi-bold text-foreground group-hover:text-primary transition-colors">{topic.title}</h3>
                                                <p className="text-sm text-muted-foreground line-clamp-2">{topic.content}</p>
                                                <div className="flex items-center gap-2 mt-3">
                                                    {topic.tags.map(tag => (
                                                        <Badge key={tag} variant="outline" className="text-[10px] text-muted-foreground border-border/60 bg-muted/20">#{tag}</Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="hidden sm:flex flex-col items-end gap-2 text-muted-foreground min-w-[3rem]">
                                                <div className="flex items-center gap-1">
                                                    <MessageSquare className="h-4 w-4" />
                                                    <span className="text-sm font-medium">{topic.replies}</span>
                                                </div>
                                                <div className="flex -space-x-2 overflow-hidden mt-1">
                                                    <Avatar className="inline-block border-2 border-background h-6 w-6">
                                                        <AvatarFallback className="text-[9px] bg-primary/10 text-primary">{topic.avatar}</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    )}
                </div>

            </div>
        </div>
    )
}
