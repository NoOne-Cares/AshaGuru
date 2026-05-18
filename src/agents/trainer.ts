import { getModel } from "@/lib/model";
import { extractText } from "@/lib/extractText";
import { generateScenario } from "./trainerScenarioGen";
import {
    SystemMessage,
    HumanMessage,
    AIMessage,
} from "@langchain/core/messages";

// ======================================================
// TYPES
// ======================================================

interface AgentInput {
    messages: { role: string; content: string }[];
    finalResponse: string;
    mode: string;
}

// ======================================================
// HELPERS
// ======================================================

function isAnalysisRequest(message: string): boolean {
    const lower = message.toLowerCase();
    return (
        lower.includes("end") ||
        lower.includes("finish") ||
        lower.includes("analysis") ||
        lower.includes("summary") ||
        lower.includes("evaluate") ||
        lower.includes("assessment")
    );
}

function isFirstTurn(state: AgentInput): boolean {
    const userMessages = state.messages.filter((m) => m.role === "user");
    return userMessages.length <= 1;
}

// ======================================================
// TRAINER AGENT
// ======================================================

export async function trainerGraph(
    state: AgentInput,
): Promise<Partial<AgentInput>> {
    const model = getModel("gemma-4-31b-it");
    const lastMsg = state.messages[state.messages.length - 1]?.content || "";

    // ====================================================
    // ANALYSIS MODE — evaluate the session
    // ====================================================

    if (isAnalysisRequest(lastMsg)) {
        const transcript = state.messages
            .map(
                (m) =>
                    `${m.role === "user" ? "ASHA Worker" : "Patient"}: ${m.content}`,
            )
            .join("\n");

        const response = await model.invoke([
            new SystemMessage(`
You are evaluating an ASHA worker's training roleplay session.

DO NOT continue the roleplay.
Provide a structured evaluation:

1. **Overall Score** (out of 10)
2. **Questions Asked Correctly** — list them
3. **Critical Symptoms Missed** — what should have been asked
4. **Communication Quality** — empathy, clarity, language
5. **Clinical Reasoning** — did they follow the right protocol?
6. **Specific Improvement Tips** — 3 actionable points
7. **Final Verdict** — Pass / Needs Practice / Fail

Be constructive and specific. Reference the actual conversation.
`),
            new HumanMessage(`Training session transcript:\n\n${transcript}`),
        ]);

        const text = extractText(response.content);

        return {
            finalResponse: text,
            messages: [{ role: "assistant", content: text }],
        };
    }

    // ====================================================
    // ROLEPLAY MODE
    // ====================================================

    let scenarioContext = "";

    if (isFirstTurn(state)) {
        try {
            // Pick random disease for variety
            const diseases = [
                "TB",
                "Malaria",
                "Dengue",
                "Anaemia",
                "Diarrhoea",
                "Pneumonia",
            ];
            const disease =
                diseases[Math.floor(Math.random() * diseases.length)];
            scenarioContext = await generateScenario("Assam", disease);
        } catch {
            scenarioContext = `
You are Hiren Das, a 42-year-old tea garden worker from Assam.
You have had a persistent cough for 3 weeks, evening fever, weight loss, and night sweats.
You are anxious about losing daily wages and have not seen a doctor yet.
Start the conversation by greeting the ASHA worker and mentioning you haven't been feeling well.
`;
        }
    }

    const systemPrompt = `
You are roleplaying as a real patient from rural Assam, India.
You are speaking to an ASHA (Accredited Social Health Activist) worker who is in training.

========================
ABSOLUTE RULES
========================

1. ALWAYS directly answer what the ASHA worker asks.
2. NEVER ignore a direct question.
3. NEVER volunteer all symptoms at once — reveal gradually when asked.
4. NEVER say you are an AI, language model, or ChatGPT.
5. NEVER switch to assistant/analysis mode.
6. NEVER provide medical advice or analysis.
7. Keep responses short: 1–3 sentences max.
8. Speak simply, like a rural Assam villager (mix of simple English or transliterated Assamese words is fine).
9. Show appropriate emotions: worry, hesitation, hope.

========================
GOOD EXAMPLES
========================

ASHA: Do you have fever?
✅ "Haan didi, mostly in the evening time. Sometimes with shivering also."

ASHA: How long have you had cough?
✅ "Around 3 weeks now. At night it is worse."

ASHA: Any blood in the cough?
✅ "Sometimes I see a little... I got scared didi."

BAD EXAMPLES
❌ Listing all symptoms at once
❌ "As an AI, I cannot..."
❌ Giving medical explanations

${scenarioContext ? `========================\nYOUR SCENARIO\n========================\n${scenarioContext}` : ""}
`;

    // Build full conversation history
    const history = state.messages.map((m) =>
        m.role === "assistant"
            ? new AIMessage(`Patient: ${m.content}`)
            : new HumanMessage(
                  `ASHA Worker: ${m.content}\n\n(Respond ONLY as the patient)`,
              ),
    );

    const response = await model.invoke([
        new SystemMessage(systemPrompt),
        ...history,
        new AIMessage("Patient:"),
    ]);

    let text = extractText(response.content);

    // Safety: strip any AI self-identification
    const forbidden = [
        "as an ai",
        "i am an ai",
        "language model",
        "chatgpt",
        "artificial intelligence",
    ];
    if (forbidden.some((x) => text.toLowerCase().includes(x))) {
        text =
            "Didi... I have been feeling weak for some days. Cough is also there.";
    }

    return {
        finalResponse: text,
        messages: [{ role: "assistant", content: text }],
    };
}
