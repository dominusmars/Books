import db from "@/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const registerForm = await request.formData();

    try {
        const title = registerForm.get("title")?.toString();
        if (!title) throw new Error("No title");
        const qty = parseInt(registerForm.get("qty")?.toString() || "1");
        if (!qty) throw new Error("No qty");

        let book = await db.addBook(title, qty);

        return NextResponse.json({ success: true, book_id: book.id });
    } catch (error: any) {
        return new NextResponse(error.message, {
            status: 400,
        });
    }
}
