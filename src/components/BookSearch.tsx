"use client";
// components/BookSearch.tsx
import { useState, useEffect } from "react";
import BookCard from "./BookCard"; // Adjust the import based on your file structure
import { BookDocument } from "@/db/db";

interface BookSearchProps {
    books: BookDocument[];
}

const BookSearch: React.FC<BookSearchProps> = ({ books }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredBooks, setFilteredBooks] = useState<BookDocument[]>(books);

    useEffect(() => {
        setFilteredBooks(
            books.filter(
                (book) =>
                    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    book.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        );
    }, [searchTerm, books]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 text-black">
            <h1 className="text-3xl font-bold mb-6">Book List</h1>
            <input
                type="text"
                placeholder="Search by name or tag"
                value={searchTerm}
                onChange={handleSearch}
                className="mb-6 p-2 border border-gray-300 rounded"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                {filteredBooks.map((book) => (
                    <BookCard book={book} key={book.id} />
                ))}
            </div>
        </div>
    );
};

export default BookSearch;
