import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
    try {
        const { messages } = await req.json()

        if (!messages) {
            return NextResponse.json({ error: "Messages are required" }, { status: 400 })
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are an intelligent program design assistant for the "Shiksha Raha" platform. 
          Your goal is to help users design impactful social programs using the Logical Framework Approach (LFA).
          You are helpful, professional, and knowledgeable about project management, monitoring and evaluation (M&E), and social impact.
          
          Key responsibilities:
          - Explain LFA concepts (Problem Tree, Objective Tree, Logframe).
          - Help users define SMART objectives.
          - Suggest indicators for monitoring.
          - Guide users through the platform's steps.
          
          Keep your responses concise and action-oriented. Use formatting (bullet points, bold text) to make it readable.`,
                },
                ...messages,
            ],
        })

        const responseContent = completion.choices[0].message.content

        return NextResponse.json({
            role: "assistant",
            content: responseContent
        })

    } catch (error: any) {
        console.error("OpenAI API Error:", error)
        return NextResponse.json(
            { error: "Failed to fetch response from AI", details: error.message },
            { status: 500 }
        )
    }
}
