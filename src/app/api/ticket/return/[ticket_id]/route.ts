import db from "@/data/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { ticket_id: string } }) {
    const ticket_id = params.ticket_id;
    try {
        const ticket = await db.getTicketById(ticket_id);
        await ticket.return();
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
