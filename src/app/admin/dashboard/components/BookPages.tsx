"use client";
import { useState, useEffect } from "react";
import BookCard from "@/components/BookCard";
import { BookDocument } from "@/data/db";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 10;

export default function BookPages({ books }: { books: BookDocument[] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentBooks, setCurrentBooks] = useState<BookDocument[]>([]);
    const router = useRouter();
    useEffect(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        setCurrentBooks(books.slice(startIndex, endIndex));
    }, [currentPage, books]);

    const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);

    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold mb-6">Book List</h1>
            <div className="flex justify-center mb-4">
                <button onClick={() => router.push("/book/register")} className="px-4 py-2 bg-blue-500 text-white rounded">
                    Register New Book
                </button>
            </div>
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="px-4 py-2 mx-1">
                    {currentPage} / {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentBooks.map((book) => (
                    <BookCard key={book.id} book={book} adminView />
                ))}
            </div>
        </div>
    );
}
