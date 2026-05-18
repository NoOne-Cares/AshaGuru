import { SystemMessage } from "@langchain/core/messages";
import { getModel } from "@/lib/model";
import { extractText } from "@/lib/extractText";

export async function generateScenario(
    region: string,
    disease: string,
): Promise<string> {
    const model = getModel("gemma-4-31b-it");
    try {
        const response = await model.invoke([
            new SystemMessage(
                `Create a realistic, culturally specific role-play scenario for an ASHA worker in ${region}, India. Patient has symptoms of ${disease}. Include environment, family dynamics, initial complaint. Output only the scenario.`,
            ),
        ]);
        return extractText(response.content);
    } catch {
        return `A ${disease} patient in ${region} with typical symptoms.`;
    }
}
