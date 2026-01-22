"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Users,
    Mail,
    MoreHorizontal,
    Plus,
    Shield,
    Search
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { useDemoStore, OrganizationMember } from "@/lib/demo-store"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function TeamPage() {
    const { user, organizationMembers, inviteOrganizationMember } = useDemoStore()
    const [isInviteOpen, setIsInviteOpen] = useState(false)
    const [inviteEmail, setInviteEmail] = useState("")
    const [inviteRole, setInviteRole] = useState<OrganizationMember["role"]>("Editor")

    const handleInvite = () => {
        if (inviteEmail) {
            inviteOrganizationMember(inviteEmail, inviteRole)
            setInviteEmail("")
            setIsInviteOpen(false)
        }
    }

    // Fallback: If for some reason store is empty (e.g. dev mode hot reload issues), show current user at least
    const members = organizationMembers.length > 0 ? organizationMembers : (user ? [{
        id: user.id,
        name: user.name,
        email: user.email,
        role: "Admin" as const,
        status: "active" as const,
        joinedAt: new Date().toISOString()
    }] : [])

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">

            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
                        Team Members
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your team's access and collaboration settings.
                    </p>
                </div>

                <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                            <Plus className="mr-2 h-4 w-4" />
                            Invite Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Invite Team Member</DialogTitle>
                            <DialogDescription>
                                Invite a colleague to collaborate on your organization's projects.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    placeholder="colleague@example.com"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="role">Role</Label>
                                <Select value={inviteRole} onValueChange={(v: any) => setInviteRole(v)}>
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                        <SelectItem value="Editor">Editor</SelectItem>
                                        <SelectItem value="Viewer">Viewer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleInvite}>Send Invitation</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Main Content */}
            <Card className="border-primary/10 bg-white/50 backdrop-blur-xl dark:bg-card/30">
                <CardHeader className="border-b border-border/50 pb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Organization Members</CardTitle>
                            <CardDescription>You have {members.length} {members.length === 1 ? 'member' : 'members'} in your organization.</CardDescription>
                        </div>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search team..." className="pl-9 bg-background/50 border-input/50" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-border/50">
                        {members.map((member) => (
                            <div key={member.id} className="flex items-center justify-between p-6 hover:bg-muted/30 transition-colors">

                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Avatar className="h-10 w-10 border border-border/50">
                                            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                                {member.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${member.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                                            }`} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">{member.name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Mail className="h-3 w-3" />
                                            {member.email}
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden md:flex flex-col gap-1 min-w-[150px]">
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</span>
                                    <span className={`text-sm font-medium ${member.status === 'active' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {member.status === 'active' ? 'Online' : 'Invite Sent'}
                                    </span>
                                </div>

                                <div className="hidden md:flex items-center gap-2 min-w-[100px]">
                                    <Badge variant="outline" className={`
                    ${member.role === 'Admin' ? 'border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300' :
                                            member.role === 'Editor' ? 'border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' :
                                                'border-slate-200 bg-slate-50 text-slate-700 dark:bg-slate-900/20 dark:text-slate-300'}
                  `}>
                                        <Shield className="mr-1 h-3 w-3" />
                                        {member.role}
                                    </Badge>
                                </div>

                                <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>

                            </div>
                        ))}
                    </div>

                    {members.length === 0 && (
                        <div className="p-12 text-center text-muted-foreground">
                            <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <h3 className="text-lg font-medium text-foreground">No members found</h3>
                            <p>Start building your team by inviting colleagues.</p>
                        </div>
                    )}

                </CardContent>
            </Card>

        </div>
    )
}
