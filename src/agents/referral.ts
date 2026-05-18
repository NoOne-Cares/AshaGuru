import { getModel } from "@/lib/model";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { extractText } from "@/lib/extractText";
interface AgentInput {
    messages: { role: string; content: string }[];
    finalResponse: string;
    specialistResults: Record<string, unknown>;
}
export async function referralGraph(state: AgentInput): Promise<AgentInput> {
    const model = getModel("gemma-4-31b-it");
    const lastMsg = state.messages[state.messages.length - 1]?.content || "";

    try {
        const response = await model.invoke([
            new SystemMessage(
                "Generate a structured referral note (patient summary, risk factors, recommended specialist, urgency) in ABDM-compatible format.",
            ),
            new HumanMessage(lastMsg),
        ]);
        const text = extractText(response.content);
        return {
            finalResponse: `📄 Referral generated:\n${text}`,
            specialistResults: { referral: text },
            messages: [{ role: "assistant", content: `Referral prepared.` }],
        };
    } catch {
        return {
            finalResponse: "Failed to generate referral. Please try again.",
            specialistResults: { referral: "Error" },
            messages: [
                { role: "assistant", content: "Referral generation failed." },
            ],
        };
    }
}
