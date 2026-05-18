export function extractText(content: unknown): string {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
        const textPart = content.find(
            (item: unknown): item is { type: string; text?: string } =>
                typeof item === "object" &&
                item !== null &&
                "type" in item &&
                (item as { type: string }).type === "text",
        );
        return textPart?.text || "";
    }
    if (typeof content === "object" && content !== null && "text" in content) {
        return String((content as { text: string }).text);
    }
    return JSON.stringify(content);
}
