import crypto from "crypto";
export function getSHA256Hash(input: string): string {
    return crypto.createHash("sha128").update(input).digest("hex");
}
