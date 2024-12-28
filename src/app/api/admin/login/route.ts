import db from "@/data/db";
import { encrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
    const { username, password } = await request.json();
    const cookieStore = await cookies();
    try {
        if (!username) {
            throw new Error("Username required");
        }
        if (!password) {
            throw new Error("Password required");
        }
        const user = await db.login(username, password);
        const jwt = await encrypt(user);
        cookieStore.set("token", jwt, { httpOnly: true, secure: true });

        return NextResponse.json({ message: "Login successful", success: true }, { status: 200 });
    } catch (error) {
        if (error instanceof Error)
            return new NextResponse(error.message, {
                status: 400,
            });
        return new NextResponse("Unknown Error", {
            status: 500,
        });
    }
}
