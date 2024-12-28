import BookCard from "@/components/BookCard";
import db from "@/data/db";
import BorrowForm from "./component/BorrowForm";

export default async function Page({ params }: { params: { book_id: string } }) {
    const book = await db.getBookById(params.book_id).catch(() => null);
    if (!book) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 text-black">
                <h1 className="text-2xl font-bold mt-4 mb-5">Book Not Found</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 text-black">
            <h1 className="text-3xl font-bold mb-6">Borrow: {book.title}</h1>
            <div className="flex flex-col gap-10 justify-center items-center sm:flex-row">
                <div className="item w-[30%]">
                    <BookCard book={book.toJson()} key={book.id} />
                </div>
                <div className="item w-[60%]">
                    <BorrowForm book_id={book.id} />
                </div>
            </div>
        </div>
    );
}
