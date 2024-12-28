import { verifySession } from "@/lib/auth";
import BookRegister from "./component/BookRegister";

export default async function Page() {
    await verifySession();
    return <BookRegister />;
}
