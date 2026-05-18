import { getModel } from "@/lib/model";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { extractText } from "@/lib/extractText";

// Define a minimal interface for the state shape this agent needs
interface AgentInput {
    messages: { role: string; content: string }[];
    finalResponse: string;
    specialistResults: Record<string, unknown>;
}

export async function reportingGraph(
    state: AgentInput,
): Promise<Partial<AgentInput>> {
    const model = getModel("gemma-4-31b-it");
    const lastMsg = state.messages[state.messages.length - 1]?.content || "";

    try {
        const response = await model.invoke([
            new SystemMessage(
                "Generate a government-format monthly health report (MCP card, NCD screening, ANC register) based on this data.",
            ),
            new HumanMessage(lastMsg),
        ]);
        const text = extractText(response.content);
        return {
            finalResponse: `📊 Report ready:\n${text}`,
            specialistResults: { reporting: text },
            messages: [{ role: "assistant", content: text }],
        };
    } catch {
        return {
            finalResponse: "Report generation failed. Try again later.",
            specialistResults: { reporting: "Error" },
            messages: [{ role: "assistant", content: "Reporting error." }],
        };
    }
}
