import db from "@/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { ticket_id: string } }) {
    const ticket_id = params.ticket_id;
    try {
        await db.getTicket(ticket_id);
        await db.returnBook(ticket_id);

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
