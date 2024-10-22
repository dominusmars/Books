import BookCard from "@/components/BookCard";
import db from "@/db/db";
import Image from "next/image";

export default async function Home() {
    let books = await db.getBooks();

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 text-black">
            <h1 className="text-3xl font-bold mb-6">Book List</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                {books.map((book) => (
                    <BookCard book={book} key={book.id} />
                ))}
            </div>
        </div>
    );
}
