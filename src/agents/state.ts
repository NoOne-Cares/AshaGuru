export interface AshaGuruState {
    messages: { role: "user" | "assistant"; content: string }[];
    audioData?: string;
    imageData?: string;
    mode:
        | "training"
        | "clinical"
        | "referral"
        | "surveillance"
        | "reporting"
        | "unknown";
    specialistResults: Record<string, unknown>;
    finalResponse: string;
    nextAgent: string;
    ashaId: string;
}
