import BookCard from "@/components/BookCard";
import db from "@/db/db";

export default async function Page({ params }: { params: { book_id: string } }) {
    const book = await db.getBookById(params.book_id);

    return (
        <div className="flex justify-center items-center h-screen bg-slate-900">
            <BookCard book={book} borrowable={book.borrowable} fullView origin={process.env["DOMAIN_URL"]} />
        </div>
    );
}
