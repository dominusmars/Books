"use client";
// components/BookSearch.tsx
import { useState, useEffect } from "react";
import BookCard from "./BookCard"; // Adjust the import based on your file structure
import { BookDocument } from "@/data/db";

interface BookSearchProps {
    books: BookDocument[];
}

const BookSearch: React.FC<BookSearchProps> = ({ books }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredBooks, setFilteredBooks] = useState<BookDocument[]>(books);
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 10;

    useEffect(() => {
        setFilteredBooks(
            books.filter(
                (book) =>
                    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    book.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        );
        setCurrentPage(1); // Reset to the first page on search
    }, [searchTerm, books]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

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
                {currentBooks.map((book) => (
                    <BookCard book={book} key={book.id} />
                ))}
            </div>
            <div className="mt-6">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-4 py-2 mx-1 border rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white text-black"}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BookSearch;
