"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function LFAGuidePage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">

            {/* Navigation */}
            <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <ChevronLeft className="h-4 w-4" />
                <Link href="/help" className="text-sm font-medium">Back to Help Center</Link>
            </div>

            {/* Header */}
            <div className="space-y-4">
                <h1 className="text-4xl font-bold font-heading bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
                    The Logical Framework Approach (LFA): A Beginner's Guide
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    Master the standard methodology used by international NGOs and governments to design high-impact programs.
                </p>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none">

                {/* Introduction */}
                <Card className="bg-primary/5 border-primary/10 not-prose mb-8">
                    <CardContent className="pt-6">
                        <h3 className="text-lg font-semibold text-primary mb-2">What is LFA?</h3>
                        <p className="text-muted-foreground">
                            The Logical Framework Approach (LFA) is a systematic planning procedure for complete project cycle management. It helps you analyze the existing situation, establish a logical hierarchy of means by which objectives will be reached, identify potential risks, and establish how outputs and outcomes will be monitored.
                        </p>
                    </CardContent>
                </Card>

                <h2>Why use LFA?</h2>
                <ul>
                    <li><strong>Clarity:</strong> It forces you to be specific about what you want to achieve.</li>
                    <li><strong>Logic:</strong> It ensures that your activities actually lead to your desired results.</li>
                    <li><strong>Communication:</strong> It provides a standard language for stakeholders.</li>
                    <li><strong>Accountability:</strong> It sets clear targets for monitoring and evaluation.</li>
                </ul>

                <hr className="my-8 border-border" />

                <h2>The 7-Step Process</h2>
                <p>Shiksha Raha guides you through the standard 7-step LFA process:</p>

                <div className="space-y-8 mt-8 not-prose">

                    {/* Step 1 */}
                    <div className="flex gap-4">
                        <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">1</div>
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">Problem Definition</h3>
                            <p className="text-muted-foreground">
                                Before designing a solution, you must deeply understand the problem. Who is affected? What is the context? This step involves researching and defining the core issue.
                            </p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-4">
                        <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">2</div>
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">Stakeholder Analysis</h3>
                            <p className="text-muted-foreground">
                                Identify everyone involved in or affected by the project. Analyze their interests, influence, and expectations to ensure your project has community support.
                            </p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-4">
                        <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">3</div>
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">Problem Tree Analysis</h3>
                            <p className="text-muted-foreground">
                                Map out the causes and effects of the central problem. This visual tree helps you identify the "root causes" that your project needs to tackle.
                            </p>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex gap-4">
                        <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">4</div>
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">Objective Tree Analysis</h3>
                            <p className="text-muted-foreground">
                                Flip your problem tree into positive statements. Used to identify the best strategy for your intervention.
                            </p>
                        </div>
                    </div>

                    {/* Step 5 */}
                    <div className="flex gap-4">
                        <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">5</div>
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">Results Chain (Theory of Change)</h3>
                            <p className="text-muted-foreground">
                                Connect your Inputs → Activities → Outputs → Outcomes → Impact. This is the "logic" of your project.
                            </p>
                        </div>
                    </div>

                    {/* Step 6 */}
                    <div className="flex gap-4">
                        <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">6</div>
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">Logical Framework Matrix (Logframe)</h3>
                            <p className="text-muted-foreground">
                                The core output. A 4x4 matrix summarizing your project design, indicators, means of verification, and assumptions.
                            </p>
                        </div>
                    </div>

                    {/* Step 7 */}
                    <div className="flex gap-4">
                        <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">7</div>
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">Monitoring & Evaluation</h3>
                            <p className="text-muted-foreground">
                                Define how you will measure success. Set baselines, targets, and data collection methods for each indicator.
                            </p>
                        </div>
                    </div>

                </div>

                <div className="mt-12 p-6 bg-muted/30 rounded-xl border border-border text-center">
                    <h3 className="text-lg font-semibold mb-2">Ready to apply what you've learned?</h3>
                    <p className="text-muted-foreground mb-6">Start designing your first impact program today.</p>
                    <Link href="/dashboard?template=blank">
                        <Button size="lg" className="shadow-lg shadow-primary/20">Start New Project</Button>
                    </Link>
                </div>

            </div>
        </div>
    )
}
