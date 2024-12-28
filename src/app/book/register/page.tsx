import { useAuth } from "@/lib/auth";
import BookRegister from "./component/BookRegister";

export default async function Page() {
    await useAuth();
    return <BookRegister />;
}
