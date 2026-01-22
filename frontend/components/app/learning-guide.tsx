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

export function LearningGuide() {
    return (
        <div className="fixed bottom-6 right-6 z-40">
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        size="lg"
                        className="h-14 w-14 rounded-full shadow-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white p-0 animate-bounce-gentle"
                    >
                        <HelpCircle className="h-8 w-8" />
                        <span className="sr-only">Open Learning Guide</span>
                    </Button>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:w-[540px] border-l-amber-500/20">
                    <SheetHeader className="mb-6">
                        <SheetTitle className="flex items-center gap-2 text-2xl">
                            <BookOpen className="h-6 w-6 text-amber-500" />
                            SikshaLokam Academy
                        </SheetTitle>
                        <SheetDescription>
                            Master the art of impact design with our in-app guide.
                        </SheetDescription>
                    </SheetHeader>

                    <ScrollArea className="h-[calc(100vh-120px)] pr-4">
                        <div className="space-y-6">

                            {/* Quick Start Guide */}
                            <div className="rounded-lg border bg-card p-4 shadow-sm">
                                <h3 className="font-semibold flex items-center gap-2 mb-2">
                                    <PlayCircle className="h-4 w-4 text-primary" />
                                    Quick Start
                                </h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    New to the platform? Learn the basics of creating your first program.
                                </p>
                                <Button variant="outline" size="sm" className="w-full justify-start">
                                    Start 2-minute Tour
                                </Button>
                            </div>

                            {/* LFA Knowledge Base */}
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                    Logical Framework Approach (LFA)
                                </h3>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>What is a Problem Tree?</AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            A Problem Tree is a visual tool used to analyze the root causes and effects of a core problem.
                                            <br /><br />
                                            <strong>Roots (Causes):</strong> Why is this happening?
                                            <br />
                                            <strong>Trunk (Core Problem):</strong> What is the main issue?
                                            <br />
                                            <strong>Branches (Effects):</strong> What are the consequences?
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger>How to write a Good Objective?</AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            Objectives should be <strong>SMART</strong>:
                                            <ul className="list-disc pl-4 mt-2 space-y-1">
                                                <li><strong>S</strong>pecific</li>
                                                <li><strong>M</strong>easurable</li>
                                                <li><strong>A</strong>ttainable</li>
                                                <li><strong>R</strong>elevant</li>
                                                <li><strong>T</strong>ime-bound</li>
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3">
                                        <AccordionTrigger>Defining Indicators</AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            Indicators are clues, signs, or markers that tell you how close you are to your path or if you are on the path at all.
                                            <div className="mt-2 bg-muted p-2 rounded text-xs">
                                                <em>Example: "Number of teachers trained" is an Output indicator. "% increase in student scores" is an Outcome indicator.</em>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>

                            {/* Best Practices */}
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <Lightbulb className="h-4 w-4 text-amber-500" />
                                    Best Practices
                                </h3>
                                <div className="grid gap-3">
                                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900">
                                        <Badge variant="outline" className="mb-2 border-amber-500 text-amber-600">Tip #1</Badge>
                                        <p className="text-sm font-medium">Involve Stakeholders Early</p>
                                        <p className="text-xs text-muted-foreground mt-1">Conduct interviews before defining your problem statement.</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900">
                                        <Badge variant="outline" className="mb-2 border-blue-500 text-blue-600">Tip #2</Badge>
                                        <p className="text-sm font-medium">Focus on Outcomes, not just Outputs</p>
                                        <p className="text-xs text-muted-foreground mt-1">Don't just count activities. Measure the change in behavior or condition.</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>

            <style jsx global>{`
        @keyframes bounce-gentle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        .animate-bounce-gentle {
            animation: bounce-gentle 2s ease-in-out infinite;
        }
      `}</style>
        </div>
    )
}
