import { NextRequest, NextResponse } from "next/server";
import { getOrchestrator } from "@/agents/orchestrator";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            messages, // full conversation history from the client
            sessionId, // used as LangGraph thread_id → persisted in Postgres
            audioData, // optional — handle transcription upstream if needed
            imageData, // optional
            ashaId, // optional metadata
        } = body;

        if (!sessionId) {
            return NextResponse.json(
                { success: false, error: "sessionId is required" },
                { status: 400 },
            );
        }

        // The client sends the full history; we only pass the latest user message
        // as the new input. LangGraph restores prior turns from Postgres.
        const lastUserMessage = messages?.findLast(
            (m: { role: string }) => m.role === "user",
        );

        if (!lastUserMessage) {
            return NextResponse.json(
                { success: false, error: "No user message found" },
                { status: 400 },
            );
        }

        const orchestrator = await getOrchestrator();

        const result = await orchestrator.invoke(
            {
                messages: [
                    {
                        role: "user",
                        content: lastUserMessage.content,
                    },
                ],
            },
            {
                configurable: {
                    thread_id: `${ashaId ?? "anon"}-${sessionId}`,
                },
            },
        );

        return NextResponse.json({
            success: true,
            finalResponse: result.finalResponse,
            messages: result.messages,
            mode: result.mode,
            surveyState: result.surveyState ?? null,
        });
    } catch (error) {
        console.error("[/api/chat] Error:", error);

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Internal server error",
            },
            { status: 500 },
        );
    }
}

// import { NextRequest, NextResponse } from "next/server";
// import { orchestratorGraph } from "@/agents/orchestrator";

// export async function POST(req: NextRequest) {
//     try {
//         const body = await req.json();
//         const { messages, audioData, imageData, ashaId, sessionId } = body;

//         const initialState = {
//             messages: messages || [],
//             audioData: audioData || undefined,
//             imageData: imageData || undefined,
//             ashaId: ashaId || "ASHA001",
//             sessionId: sessionId || "default",
//             mode: "unknown",
//             nextAgent: "",
//             specialistResults: {},
//             finalResponse: "",
//         };

//         const result = await orchestratorGraph.invoke(initialState);

//         return NextResponse.json({
//             success: true,
//             finalResponse: result.finalResponse,
//             messages: result.messages,
//         });
//     } catch (error: unknown) {
//         const message = error instanceof Error ? error.message : String(error);
//         console.error("ASHA Guru error:", message);
//         return NextResponse.json(
//             { success: false, error: message },
//             { status: 500 },
//         );
//     }
// }

// import { NextRequest, NextResponse } from "next/server";

// import { orchestratorGraph } from "@/agents/orchestrator";

// export async function POST(req: NextRequest) {
//     try {
//         const body = await req.json();

//         const {
//             message,
//             sessionId,
//         } = body;

//         // ==========================================
//         // INVOKE GRAPH
//         // ==========================================

//         const result = await orchestratorGraph.invoke(
//             {
//                 messages: [
//                     {
//                         role: "user",
//                         content: message,
//                     },
//                 ],
//             },
//             {
//                 configurable: {
//                     thread_id: sessionId,
//                 },
//             },
//         );

//         return NextResponse.json({
//             success: true,

//             finalResponse:
//                 result.finalResponse,

//             messages: result.messages,

//             mode: result.mode,
//         });
//     } catch (error) {
//         console.error(error);

//         return NextResponse.json(
//             {
//                 success: false,
//                 error: "Internal server error",
//             },
//             {
//                 status: 500,
//             },
//         );
//     }
// }
