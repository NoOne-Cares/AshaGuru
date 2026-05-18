import { StateGraph, Annotation, START, END } from "@langchain/langgraph";

import { getPostgresCheckpointer } from "./checkpointer";
import { trainerGraph } from "./trainer";
import { surveyGraph, defaultSurveyState, type SurveyState } from "./survey";
import { getModel } from "@/lib/model";
import { extractText } from "@/lib/extractText";

// ======================================================
// REDUCERS
// ======================================================

const messagesReducer = (
    a: { role: string; content: string }[],
    b: { role: string; content: string }[],
) => a.concat(b);

const replaceReducer = <T>(_: T, b: T) => b;

// ======================================================
// STATE DEFINITION
// ======================================================

export const GraphState = Annotation.Root({
    messages: Annotation<{ role: string; content: string }[]>({
        reducer: messagesReducer,
        default: () => [],
    }),

    mode: Annotation<string>({
        reducer: replaceReducer,
        default: () => "unknown",
    }),

    nextAgent: Annotation<string>({
        reducer: replaceReducer,
        default: () => "",
    }),

    finalResponse: Annotation<string>({
        reducer: replaceReducer,
        default: () => "",
    }),

    // Survey-specific sub-state persisted across turns
    surveyState: Annotation<SurveyState>({
        reducer: replaceReducer,
        default: () => defaultSurveyState,
    }),
});

export type State = typeof GraphState.State;

// ======================================================
// MODE DETECTION — LLM-assisted routing
// ======================================================

async function decideMode(state: State): Promise<Partial<State>> {
    const lastMsg = state.messages[state.messages.length - 1]?.content || "";
    const lower = lastMsg.toLowerCase();

    // ── Hard keyword shortcuts (fast path) ──────────────

    const TRAINING_KEYWORDS = [
        "train",
        "roleplay",
        "role play",
        "practice",
        "simulate",
        "patient scenario",
    ];
    const SURVEY_KEYWORDS = [
        "survey",
        "diagnose",
        "identify disease",
        "check symptoms",
        "symptom check",
        "assess patient",
        "screening",
    ];

    if (TRAINING_KEYWORDS.some((k) => lower.includes(k))) {
        return { mode: "training", nextAgent: "trainer" };
    }

    if (SURVEY_KEYWORDS.some((k) => lower.includes(k))) {
        return {
            mode: "survey",
            nextAgent: "survey",
            surveyState: defaultSurveyState,
        };
    }

    // ── Sticky mode: stay in current mode across turns ──
    if (state.mode === "training")
        return { mode: "training", nextAgent: "trainer" };
    if (state.mode === "survey") return { mode: "survey", nextAgent: "survey" };

    // ── LLM router for ambiguous first messages ──────────
    try {
        const model = getModel("gemma-4-31b-it");
        const response = await model.invoke([
            {
                role: "system",
                content: `You are a routing assistant for ASHA Guru, an AI health assistant for ASHA workers in India.

Classify the user's message into exactly one of these two modes:

"training" — The ASHA worker wants to practice patient interactions through roleplay/simulation to improve clinical skills.

"survey"   — The ASHA worker is with a real patient and needs help conducting a structured health survey to identify diseases.

Reply with ONLY the single word: training OR survey`,
            },
            { role: "user", content: lastMsg },
        ] as { role: string; content: string }[]);

        const decision = extractText(response.content).trim().toLowerCase();

        if (decision.includes("survey")) {
            return {
                mode: "survey",
                nextAgent: "survey",
                surveyState: defaultSurveyState,
            };
        }
    } catch {
        // fall through to default
    }

    // Default: training
    return { mode: "training", nextAgent: "trainer" };
}

// ======================================================
// CONDITIONAL EDGE RESOLVER
// ======================================================

function routeToAgent(state: State): string {
    return state.nextAgent || "trainer";
}

// ======================================================
// GRAPH BUILDER (async — needs Postgres checkpointer)
// ======================================================

let _compiledGraph: Awaited<ReturnType<typeof buildGraph>> | null = null;

async function buildGraph() {
    const checkpointer = await getPostgresCheckpointer();

    return new StateGraph(GraphState)
        .addNode("decideMode", decideMode)
        .addNode(
            "trainer",
            trainerGraph as (state: State) => Promise<Partial<State>>,
        )
        .addNode(
            "survey",
            surveyGraph as (state: State) => Promise<Partial<State>>,
        )
        .addEdge(START, "decideMode")
        .addConditionalEdges("decideMode", routeToAgent, {
            trainer: "trainer",
            survey: "survey",
        })
        .addEdge("trainer", END)
        .addEdge("survey", END)
        .compile({ checkpointer });
}

// Lazy singleton — initialised once on first request
export async function getOrchestrator() {
    if (!_compiledGraph) {
        _compiledGraph = await buildGraph();
    }
    return _compiledGraph;
}

// // import { StateGraph, END, START, Annotation } from "@langchain/langgraph";
// // import { clinicianGraph } from "./clinician";
// // import { trainerGraph } from "./trainer";
// // import { referralGraph } from "./referral";
// // import { surveillanceGraph } from "./surveillance";
// // import { reportingGraph } from "./reporting";

// // // ---------- Typed Reducers ----------
// // const messagesReducer = (
// //     a: { role: string; content: string }[],
// //     b: { role: string; content: string }[],
// // ) => a.concat(b);
// // const replaceReducer = <T>(_: T, b: T) => b;
// // const objectMergeReducer = (
// //     a: Record<string, unknown>,
// //     b: Record<string, unknown>,
// // ) => ({ ...a, ...b });

// // // ---------- State Definition ----------
// // const GraphState = Annotation.Root({
// //     messages: Annotation<{ role: string; content: string }[]>({
// //         reducer: messagesReducer,
// //         default: () => [],
// //     }),
// //     mode: Annotation<string>({
// //         reducer: replaceReducer,
// //         default: () => "unknown",
// //     }),
// //     nextAgent: Annotation<string>({
// //         reducer: replaceReducer,
// //         default: () => "",
// //     }),
// //     finalResponse: Annotation<string>({
// //         reducer: replaceReducer,
// //         default: () => "",
// //     }),
// //     specialistResults: Annotation<Record<string, unknown>>({
// //         reducer: objectMergeReducer,
// //         default: () => ({}),
// //     }),
// //     audioData: Annotation<string | undefined>({
// //         reducer: replaceReducer,
// //         default: () => undefined,
// //     }),
// //     imageData: Annotation<string | undefined>({
// //         reducer: replaceReducer,
// //         default: () => undefined,
// //     }),
// //     ashaId: Annotation<string>({
// //         reducer: replaceReducer,
// //         default: () => "ASHA001",
// //     }),
// //     sessionId: Annotation<string>({
// //         reducer: replaceReducer,
// //         default: () => "default",
// //     }),
// // });

// // type State = typeof GraphState.State;

// // // ---------- Routing Node ----------
// // async function decideMode(state: State): Promise<Partial<State>> {
// //     const lastMsg = state.messages[state.messages.length - 1]?.content || "";
// //     if (lastMsg.includes("train") || lastMsg.includes("roleplay"))
// //         return { mode: "training", nextAgent: "trainer" };
// //     if (lastMsg.includes("report") || lastMsg.includes("dashboard"))
// //         return { mode: "reporting", nextAgent: "reporting" };
// //     if (lastMsg.includes("outbreak") || lastMsg.includes("surveillance"))
// //         return { mode: "surveillance", nextAgent: "surveillance" };
// //     if (lastMsg.includes("refer") || lastMsg.includes("send"))
// //         return { mode: "referral", nextAgent: "referral" };
// //     return { mode: "clinical", nextAgent: "clinician" };
// // }

// // // ---------- Graph ----------
// // export const orchestratorGraph = new StateGraph(GraphState)
// //     .addNode("decideMode", decideMode)
// //     .addNode("clinician", clinicianGraph)
// //     .addNode("trainer", trainerGraph)
// //     .addNode("referral", referralGraph)
// //     .addNode("surveillance", surveillanceGraph)
// //     .addNode("reporting", reportingGraph)
// //     .addEdge(START, "decideMode")
// //     .addConditionalEdges("decideMode", (state: State) => state.nextAgent, {
// //         clinician: "clinician",
// //         trainer: "trainer",
// //         referral: "referral",
// //         surveillance: "surveillance",
// //         reporting: "reporting",
// //     })
// //     .addEdge("clinician", END)
// //     .addEdge("trainer", END)
// //     .addEdge("referral", END)
// //     .addEdge("surveillance", END)
// //     .addEdge("reporting", END)
// //     .compile();

// import {
//     StateGraph,
//     Annotation,
//     START,
//     END,
//     MemorySaver,
// } from "@langchain/langgraph";

// import { trainerGraph } from "./trainer";

// // ======================================================
// // REDUCERS
// // ======================================================

// const messagesReducer = (
//     a: { role: string; content: string }[],
//     b: { role: string; content: string }[],
// ) => a.concat(b);

// const replaceReducer = <T>(_: T, b: T) => b;

// // ======================================================
// // STATE
// // ======================================================

// export const GraphState = Annotation.Root({
//     messages: Annotation<{ role: string; content: string }[]>({
//         reducer: messagesReducer,
//         default: () => [],
//     }),

//     mode: Annotation<string>({
//         reducer: replaceReducer,
//         default: () => "unknown",
//     }),

//     nextAgent: Annotation<string>({
//         reducer: replaceReducer,
//         default: () => "",
//     }),

//     finalResponse: Annotation<string>({
//         reducer: replaceReducer,
//         default: () => "",
//     }),
// });

// export type State = typeof GraphState.State;

// // ======================================================
// // ROUTER
// // ======================================================

// async function decideMode(
//     state: State,
// ): Promise<Partial<State>> {
//     const lastMsg =
//         state.messages[state.messages.length - 1]?.content
//             ?.toLowerCase() || "";

//     // ==========================================
//     // START TRAINING MODE
//     // ==========================================

//     if (
//         lastMsg.includes("train") ||
//         lastMsg.includes("roleplay") ||
//         lastMsg.includes("start")
//     ) {
//         return {
//             mode: "training",
//             nextAgent: "trainer",
//         };
//     }

//     // ==========================================
//     // STAY IN TRAINING MODE
//     // ==========================================

//     if (state.mode === "training") {
//         return {
//             mode: "training",
//             nextAgent: "trainer",
//         };
//     }

//     // ==========================================
//     // DEFAULT
//     // ==========================================

//     return {
//         mode: "training",
//         nextAgent: "trainer",
//     };
// }

// // ======================================================
// // MEMORY CHECKPOINTER
// // ======================================================

// const memory = new MemorySaver();

// // ======================================================
// // GRAPH
// // ======================================================

// export const orchestratorGraph = new StateGraph(
//     GraphState,
// )
//     .addNode("decideMode", decideMode)

//     .addNode("trainer", trainerGraph)

//     .addEdge(START, "decideMode")

//     .addConditionalEdges(
//         "decideMode",
//         (state: State) => state.nextAgent,
//         {
//             trainer: "trainer",
//         },
//     )

//     .addEdge("trainer", END)

//     .compile({
//         checkpointer: memory,
//     });
