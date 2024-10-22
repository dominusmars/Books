import crypto from "crypto";
export function getSHA256Hash(input: string): string {
    return crypto.createHash('sha256').update(input).digest("hex");
}
