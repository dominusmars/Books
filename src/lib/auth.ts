import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { decrypt } from "./session";
import { redirect } from "next/navigation";

export const verifySession = cache(async () => {
    const cookie = (await cookies()).get("token")?.value;
    const session = await decrypt(cookie);

    if (!session) {
        redirect("/admin/login");
    }

    return { isAuth: true, user: session };
});
