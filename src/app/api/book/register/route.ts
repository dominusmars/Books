import db from "@/data/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const bookRequest = await request.json();

    try {
        const book = await db.addBook(bookRequest);

        return NextResponse.json({ success: true, book_id: book.id });
    } catch (error: unknown) {
        if (error instanceof Error)
            return new NextResponse(error.message, {
                status: 400,
            });
        else {
            return new NextResponse("An error occurred", {
                status: 500,
            });
        }
    }
}
