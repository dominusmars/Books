import db from "@/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const requestJSON = await request.json();

    try {
        const book_id = requestJSON.book_id;
        if (!book_id) throw new Error("No book_id");

        await db.decreaseQty(book_id);

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        if (error instanceof Error)
            return new NextResponse(error.message, {
                status: 400,
            });
        return new NextResponse("Unknown Error", {
            status: 500,
        });
    }
}
