import { getModel } from "@/lib/model";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { extractText } from "@/lib/extractText";

interface AgentInput {
    messages: { role: string; content: string }[];
    finalResponse: string;
    specialistResults: Record<string, unknown>;
}

export async function surveillanceGraph(
    state: AgentInput,
): Promise<AgentInput> {
    const model = getModel("gemma-4-31b-it");
    const lastMsg = state.messages[state.messages.length - 1]?.content || "";

    try {
        const response = await model.invoke([
            new SystemMessage(
                "Analyze patient data for potential disease outbreak patterns. Provide early warning if needed.",
            ),
            new HumanMessage(lastMsg),
        ]);
        const text = extractText(response.content);
        return {
            finalResponse: `🚨 Surveillance alert:\n${text}`,
            specialistResults: { surveillance: text },
            messages: [{ role: "assistant", content: text }],
        };
    } catch {
        return {
            finalResponse: "Surveillance analysis unavailable at the moment.",
            specialistResults: { surveillance: "Error" },
            messages: [{ role: "assistant", content: "Surveillance error." }],
        };
    }
}
