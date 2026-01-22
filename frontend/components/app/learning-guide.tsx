"use client"

import { BookOpen, HelpCircle, Lightbulb, PlayCircle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Target } from "lucide-react"

export function LearningGuide() {
    return (
        <div className="fixed bottom-6 right-6 z-40">
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        size="lg"
                        className="h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white p-0 animate-bounce-gentle ring-4 ring-white/20"
                    >
                        <HelpCircle className="h-8 w-8" />
                        <span className="sr-only">Open Learning Guide</span>
                    </Button>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:w-[600px] border-l-amber-500/20 bg-background/95 backdrop-blur-xl">
                    <SheetHeader className="mb-6">
                        <SheetTitle className="flex items-center gap-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600">
                            <BookOpen className="h-6 w-6 text-amber-500" />
                            SikshaLokam Academy
                        </SheetTitle>
                        <SheetDescription>
                            Your interactive companion for impact design.
                        </SheetDescription>
                    </SheetHeader>

                    <Tabs defaultValue="concepts" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-4">
                            <TabsTrigger value="concepts">Concepts</TabsTrigger>
                            <TabsTrigger value="walkthrough">Walkthrough</TabsTrigger>
                            <TabsTrigger value="best-practices">Tips</TabsTrigger>
                        </TabsList>

                        <ScrollArea className="h-[calc(100vh-180px)] pr-4">

                            {/* CONCEPTS TAB */}
                            <TabsContent value="concepts" className="space-y-6 mt-0">
                                <div className="rounded-xl border bg-card p-4 shadow-sm">
                                    <h3 className="font-semibold flex items-center gap-2 mb-3 text-lg">
                                        <FileText className="h-5 w-5 text-primary" />
                                        Logical Framework Approach (LFA)
                                    </h3>
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="lfa-1">
                                            <AccordionTrigger className="hover:text-primary">What is LFA?</AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                                The Logical Framework Approach (LFA) is a systematic way to design projects. It helps you connect what you do (Activity) to what you want to achieve (Impact).
                                                <div className="mt-4 p-3 bg-muted rounded-lg border text-xs font-mono">
                                                    Inputs → Activities → Outputs → Outcomes → Impact
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="lfa-2">
                                            <AccordionTrigger className="hover:text-primary">Problem Tree Analysis</AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground space-y-2">
                                                <p>Visualizes the cause-and-effect relationships of a problem.</p>
                                                <ul className="list-none space-y-2 mt-2">
                                                    <li className="flex gap-2">
                                                        <span className="font-bold text-red-500">Roots:</span>
                                                        <span>Causes (Why is it happening?)</span>
                                                    </li>
                                                    <li className="flex gap-2">
                                                        <span className="font-bold text-amber-500">Trunk:</span>
                                                        <span>Core Problem (The main issue)</span>
                                                    </li>
                                                    <li className="flex gap-2">
                                                        <span className="font-bold text-green-500">Branches:</span>
                                                        <span>Effects (What are the consequences?)</span>
                                                    </li>
                                                </ul>
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem value="lfa-3">
                                            <AccordionTrigger className="hover:text-primary">Choosing Indicators</AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground">
                                                <p className="mb-3">Indicators help you measure success. They answer: "How do we know we are there?"</p>
                                                <div className="space-y-3">
                                                    <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-100 dark:border-blue-900">
                                                        <p className="font-semibold text-blue-700 dark:text-blue-400 text-xs uppercase mb-1">Output Indicator</p>
                                                        <p className="text-sm">Measures direct deliverables.</p>
                                                        <p className="text-xs italic mt-1">"Number of teachers trained"</p>
                                                    </div>
                                                    <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded border border-purple-100 dark:border-purple-900">
                                                        <p className="font-semibold text-purple-700 dark:text-purple-400 text-xs uppercase mb-1">Outcome Indicator</p>
                                                        <p className="text-sm">Measures change in behavior/skills.</p>
                                                        <p className="text-xs italic mt-1">"% of teachers using new methods"</p>
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            </TabsContent>

                            {/* WALKTHROUGH TAB */}
                            <TabsContent value="walkthrough" className="space-y-4 mt-0">
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base">Interactive Tours</CardTitle>
                                        <CardDescription>Step-by-step guides to master the platform.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid gap-3">
                                        <Button variant="outline" className="justify-start h-auto py-3 text-left group">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                <PlayCircle className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-semibold">Create First Program</div>
                                                <div className="text-xs text-muted-foreground">2 mins • Basics</div>
                                            </div>
                                        </Button>
                                        <Button variant="outline" className="justify-start h-auto py-3 text-left group">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                <PlayCircle className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-semibold">Theory of Change</div>
                                                <div className="text-xs text-muted-foreground">5 mins • Advanced</div>
                                            </div>
                                        </Button>
                                    </CardContent>
                                    <CardFooter>
                                        <p className="text-xs text-muted-foreground text-center w-full">More tours coming soon.</p>
                                    </CardFooter>
                                </Card>
                            </TabsContent>

                            {/* TIPS TAB */}
                            <TabsContent value="best-practices" className="space-y-4 mt-0">
                                <div className="grid gap-4">
                                    <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/40 dark:to-orange-950/20 p-4">
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <Lightbulb className="h-24 w-24 text-amber-500" />
                                        </div>
                                        <div className="relative">
                                            <Badge className="mb-2 bg-amber-500 hover:bg-amber-600">Golden Rule</Badge>
                                            <h4 className="font-bold text-lg mb-1">Involve Stakeholders</h4>
                                            <p className="text-sm text-muted-foreground">Don't design in a silo. The best programs are co-created with the people they are meant to serve.</p>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl border bg-card">
                                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                                            <Target className="h-4 w-4 text-blue-500" />
                                            SMART Objectives
                                        </h4>
                                        <p className="text-sm text-muted-foreground mb-3">Ensure all your objectives meet these criteria:</p>
                                        <div className="grid grid-cols-5 gap-1 text-center text-xs font-medium">
                                            <div className="bg-muted p-1 rounded">Specific</div>
                                            <div className="bg-muted p-1 rounded">Measurable</div>
                                            <div className="bg-muted p-1 rounded">Achieveable</div>
                                            <div className="bg-muted p-1 rounded">Relevant</div>
                                            <div className="bg-muted p-1 rounded">Time-bound</div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                        </ScrollArea>
                    </Tabs>
                </SheetContent>
            </Sheet>

            <style jsx global>{`
        @keyframes bounce-gentle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
        }
        .animate-bounce-gentle {
            animation: bounce-gentle 3s ease-in-out infinite;
        }
      `}</style>
        </div>
    )
}
