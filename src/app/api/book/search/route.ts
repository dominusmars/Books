import { books } from "@/data/googleBook";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const registerForm = await request.formData();

    try {
        const title = registerForm.get("title")?.toString();
        if (!title) throw new Error("No title");

        const googleRequest = await books.volumes.list({
            q: title,
        });
        if (!googleRequest.data.items || googleRequest.data.items?.length == 0) {
            throw new Error(`Unable to find book with name ${title}`);
        }

        return NextResponse.json(googleRequest.data.items.splice(0, 10));
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
