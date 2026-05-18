export function cleanBase64(base64: string): string {
    return base64.replace(/^data:.*;base64,/, "");
}