import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
    try {
        const { project } = await req.json()

        if (!project) {
            return NextResponse.json({ error: "Project data is required" }, { status: 400 })
        }

        // simplify the project data sent to AI to save tokens and focus on content
        const projectSummary = {
            name: project.name,
            description: project.description,
            problem: project.data.problemDefinition,
            problemHelper: project.data.problemTree,
            objectives: project.data.objectiveTree,
            logframe: project.data.logframe,
            indicators: project.data.monitoring,
        }

        const prompt = `
    You are a Senior Program Officer and M&E Expert. 
    Review the following project data designed using the Logical Framework Approach (LFA):
    
    ${JSON.stringify(projectSummary, null, 2)}

    Your task is to generate a "Detailed Rulebook" for the user. 
    The output should be in Markdown format.
    
    Structure the report as follows:

    # Project Analysis Report: ${project.name}

    ## 1. Executive Scorecard
    - **Logic Score**: (0-100)
    - **Clarity Score**: (0-100)
    - **Feasibility Score**: (0-100)
    - **Summary Verdict**: (1-2 sentences on the overall state of the project)

    ## 2. Critical Analysis (What is Wrong?)
    *Analyze the "Problem Tree" vs "Objective Tree" alignment and the Logframe logic.*
    - **Logical Gaps**: (Identify where causes don't lead to effects or activities don't lead to outputs)
    - **Missing Elements**: (e.g., vague assumptions, missing indicators)
    - **Risks**: (Potential pitfalls based on current design)

    ## 3. Optimization Strategy (How to Fix It?)
    *Concrete suggestions to improve the project.*
    - **Refined Problem Statement**: (Rewrite their problem statement to be more specific)
    - **SMART Objective Suggestions**: (Rewrite their objectives to be Specific, Measurable, Achievable, Relevant, Time-bound)
    - **Indicator Improvements**: (Suggest better indicators for their Goal/Purpose)

    ## 4. The Execution Rulebook (What to Do Next?)
    *A step-by-step checklist for the user to execute this project successfully.*
    - [ ] Step 1: ...
    - [ ] Step 2: ...
    - [ ] Step 3: ...
    
    Use bold key terms. Be critical but constructive. If fields are empty (""), point that out as a critical flaw.
    `

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are an expert consultant in Social Impact and Project Management. You provide detailed, actionable, and critical feedback.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
        })

        const reportContent = completion.choices[0].message.content

        return NextResponse.json({
            report: reportContent
        })

    } catch (error: any) {
        console.error("Report Generation Error:", error)
        return NextResponse.json(
            { error: "Failed to generate report", details: error.message },
            { status: 500 }
        )
    }
}
