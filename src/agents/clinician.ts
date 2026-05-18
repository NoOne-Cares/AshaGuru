import { getModel } from "@/lib/model";
import { searchProtocols } from "@/lib/localRAG";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { extractText } from "@/lib/extractText";

interface AgentInput {
    messages: { role: string; content: string }[];
    finalResponse: string;
    specialistResults: Record<string, unknown>;
}
export async function clinicianGraph(state: AgentInput): Promise<AgentInput> {
    const model = getModel("gemma-4-31b-it");
    const lastMsg = state.messages[state.messages.length - 1]?.content || "";

    let protocolContext = "";
    try {
        protocolContext = (await searchProtocols(lastMsg)).join("\n");
    } catch {}

    const systemPrompt = `You are ASHA Guru's Clinician Agent. Use these protocols: ${protocolContext}. Provide triage, advice, next steps.`;

    try {
        const response = await model.invoke([
            new SystemMessage(systemPrompt),
            new HumanMessage(lastMsg),
        ]);
        const text = extractText(response.content);
        return {
            finalResponse: text,
            specialistResults: { clinician: text },
            messages: [{ role: "assistant", content: text }],
        };
    } catch {
        const fallback = "Sorry, I couldn't process that right now.";
        return {
            finalResponse: fallback,
            specialistResults: { clinician: fallback },
            messages: [{ role: "assistant", content: fallback }],
        };
    }
}
