import BookCard from "@/components/BookCard";
import db from "@/data/db";

export default async function Page({ params }: { params: { book_id: string } }) {
    const book = await db.getBookById(params.book_id).catch(() => null);
    if (!book) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-900">
                <h1 className="text-2xl font-bold mt-4 mb-5 text-white">Book Not Found</h1>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center h-screen bg-slate-900">
            <BookCard book={book.toJson()} borrowable={await book.canBorrow()} fullView origin={process.env["DOMAIN_URL"]} />
        </div>
    );
}
