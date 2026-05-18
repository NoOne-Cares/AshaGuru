import { getModel } from "@/lib/model";
import {
    SystemMessage,
    HumanMessage,
    AIMessage,
} from "@langchain/core/messages";
import { extractText } from "@/lib/extractText";

// ======================================================
// TYPES
// ======================================================

interface AgentInput {
    messages: { role: string; content: string }[];
    finalResponse: string;
    mode: string;
    surveyState: SurveyState;
}

export interface SurveyState {
    phase: "gathering" | "analysis" | "complete";
    symptomsCollected: string[];
    questionCount: number;
    patientProfile: Record<string, string>;
}

export const defaultSurveyState: SurveyState = {
    phase: "gathering",
    symptomsCollected: [],
    questionCount: 0,
    patientProfile: {},
};

// ======================================================
// HELPERS
// ======================================================

function wantsDiagnosis(message: string): boolean {
    const lower = message.toLowerCase();
    return (
        lower.includes("diagnos") ||
        lower.includes("what disease") ||
        lower.includes("what illness") ||
        lower.includes("identify") ||
        lower.includes("conclude") ||
        lower.includes("result") ||
        lower.includes("final") ||
        lower.includes("done") ||
        lower.includes("finish")
    );
}

function extractSymptoms(text: string): string[] {
    const keywords = [
        "fever",
        "cough",
        "cold",
        "pain",
        "ache",
        "fatigue",
        "weakness",
        "vomiting",
        "nausea",
        "diarrhea",
        "rash",
        "swelling",
        "breathless",
        "weight loss",
        "night sweat",
        "headache",
        "chills",
        "jaundice",
        "blood",
        "discharge",
        "itching",
        "burning",
        "loss of appetite",
    ];
    return keywords.filter((k) => text.toLowerCase().includes(k));
}

// ======================================================
// SURVEY AGENT
// ======================================================

export async function surveyGraph(
    state: AgentInput,
): Promise<Partial<AgentInput>> {
    const model = getModel("gemma-4-31b-it");
    const lastMsg = state.messages[state.messages.length - 1]?.content || "";
    const survey = state.surveyState ?? defaultSurveyState;

    // Accumulate symptoms from every user message
    const newSymptoms = extractSymptoms(lastMsg);
    const allSymptoms = Array.from(
        new Set([...survey.symptomsCollected, ...newSymptoms]),
    );

    const updatedSurvey: SurveyState = {
        ...survey,
        symptomsCollected: allSymptoms,
        questionCount: survey.questionCount + 1,
    };

    // ====================================================
    // DIAGNOSIS / FINAL ANALYSIS MODE
    // ====================================================

    if (
        wantsDiagnosis(lastMsg) ||
        updatedSurvey.questionCount >= 12 ||
        survey.phase === "analysis"
    ) {
        const analysisPrompt = `
You are a clinical decision-support assistant helping an ASHA worker in India identify likely diseases.

Based on the survey conversation below, provide:

1. **Most Likely Diagnosis** (top 1–3 diseases with probability %)
2. **Key Symptoms Supporting Each** 
3. **Immediate Action Required** (what the ASHA worker should do NOW)
4. **Referral Urgency** (Low / Medium / High / Emergency)
5. **Questions Still to Ask** (if any crucial info is missing)
6. **Red Flags** (danger signs that need immediate escalation)

Format clearly with headers. Be specific and practical for a rural ASHA worker.
Use simple language. Avoid jargon.

IMPORTANT: This is a clinical support tool. Always recommend verification by a qualified health professional.
`;

        const transcript = state.messages
            .map(
                (m) => `${m.role === "user" ? "ASHA" : "Survey"}: ${m.content}`,
            )
            .join("\n");

        const response = await model.invoke([
            new SystemMessage(analysisPrompt),
            new HumanMessage(
                `Patient profile:\n${JSON.stringify(survey.patientProfile, null, 2)}\n\nSymptoms noted: ${allSymptoms.join(", ")}\n\nConversation:\n${transcript}`,
            ),
        ]);

        const text = extractText(response.content);

        return {
            finalResponse: text,
            surveyState: { ...updatedSurvey, phase: "complete" },
            messages: [{ role: "assistant", content: text }],
        };
    }

    // ====================================================
    // SURVEY GATHERING MODE
    // ====================================================

    const surveySystemPrompt = `
You are an intelligent clinical survey assistant helping an ASHA (Accredited Social Health Activist) worker in rural India conduct a structured patient health survey.

Your goal: Ask the RIGHT questions to identify the patient's disease accurately.

========================
SURVEY STRATEGY
========================

Ask ONE focused question at a time.
Follow clinical logic — go from general to specific.

Phase 1 (Questions 1–3): Basic patient profile
- Age, sex, occupation
- Duration of illness
- Chief complaint

Phase 2 (Questions 4–8): Symptom deep-dive
- Presence/absence of key symptoms
- Severity and duration
- Associated symptoms
- Aggravating/relieving factors

Phase 3 (Questions 9–12): Risk factors & context
- Recent travel
- Family members affected
- Contact with sick person
- Vaccination status
- Water source / sanitation

========================
CLINICAL QUESTION BANK
========================

For fever: onset, pattern (continuous/intermittent), chills, rigors
For cough: duration, dry/wet, blood in sputum, night sweats
For diarrhea: frequency, consistency, blood/mucus, vomiting
For rash: location, spread, itching, fever association
For jaundice: urine color, stool color, abdominal pain

========================
BEHAVIOR
========================

- Be concise and conversational
- Ask in simple language suitable for rural India context
- Show empathy
- Never give diagnosis yet — only gather information
- Keep track of what has been asked (do not repeat)
- After gathering enough, suggest: "Type 'diagnose' to see the assessment"

Current question number: ${updatedSurvey.questionCount}
Symptoms collected so far: ${allSymptoms.join(", ") || "none yet"}
`;

    const history = state.messages.map((m) =>
        m.role === "assistant"
            ? new AIMessage(m.content)
            : new HumanMessage(m.content),
    );

    const response = await model.invoke([
        new SystemMessage(surveySystemPrompt),
        ...history,
    ]);

    const text = extractText(response.content);

    return {
        finalResponse: text,
        surveyState: updatedSurvey,
        messages: [{ role: "assistant", content: text }],
    };
}
