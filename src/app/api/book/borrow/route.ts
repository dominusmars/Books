import db from "@/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const registerForm = await request.formData();

    try {
        const netid = registerForm.get("netid")?.toString();
        if (!netid) throw new Error("No netid");
        const netid_check_reg = new RegExp(/\w+\d/g);
        const check = netid_check_reg.test(netid);
        if (!check) throw new Error("netid is not valid");

        const name = registerForm.get("name")?.toString();
        if (!name) throw new Error("No name");
        const book_id = registerForm.get("book_id")?.toString();
        if (!book_id) throw new Error("No book_id");

        const ticket = await db.borrowBook(book_id, name, netid);

        return NextResponse.json({ success: true, ticket: ticket });
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
