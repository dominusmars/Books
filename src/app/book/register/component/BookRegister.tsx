"use client";
import React from "react";
import { books_v1 } from "@googleapis/books";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {};

function BookRegister({}: Props) {
    const [title, setTitle] = useState("");
    const [GoogleBooks, setGoogleBooks] = useState<books_v1.Schema$Volume[]>([]);
    const [Loading, setLoading] = useState(false);
    const [selectedBook, setSelectedBook] = useState<books_v1.Schema$Volume | null>(null);
    const [Errored, setError] = useState<string | boolean>(false);
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBook) return setError("No book selected");
        try {
            setLoading(true);
            const response = await fetch("/api/book/register", {
                method: "POST",
                body: JSON.stringify(selectedBook),
            });

            if (!response.ok) {
                throw new Error("Failed to register book");
            }

            const result = await response.json();
            router.push("/book/view/" + result.book_id);
        } catch (error: unknown) {
            if (error instanceof Error) setError(error.message);
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };
    const searchBook = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);

        try {
            setLoading(true);
            const response = await fetch("/api/book/search", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to search book");
            }

            const result = await response.json();
            setGoogleBooks(result);
        } catch (error: unknown) {
            setError((error as Error)?.message);
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 gap-10">
            <form onSubmit={searchBook} className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl mb-4">Book Form</h2>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>

                {Errored && <div className="md-4 text-red-800">{Errored}</div>}
                {Loading && <div className="md-4 text-blue-800">Loading...</div>}
                <div className="flex gap-3">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Search
                    </button>
                    <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={handleSubmit}>
                        Register
                    </button>
                </div>
            </form>

            {GoogleBooks.length > 0 && (
                <div className="bg-white p-8 rounded shadow-md">
                    <h2 className="text-2xl mb-4">Books</h2>
                    <div className="flex gap-3 flex-wrap">
                        {GoogleBooks.map((book, i) => {
                            const info = book.volumeInfo;
                            if (!info) return null;
                            if (!info.authors) info.authors = ["Unknown"];
                            if (!info.authors) info.authors = ["Unknown"];
                            if (!info.description) info.description = "No description available";
                            if (!info.imageLinks) return null;
                            if (!info.title) return null;
                            if (!info.categories) info.categories = [];
                            if (!info.pageCount) info.pageCount = 0;
                            if (!info.averageRating) info.averageRating = 0;
                            return (
                                <div
                                    key={i}
                                    className={
                                        `bg-white p-4 rounded-lg shadow-lg hover:shadow-sm hover:bg-slate-400 max-w-sm ` +
                                        (selectedBook === book ? "border-2 border-blue-500" : "")
                                    }
                                    onClick={() => setSelectedBook(book)}
                                >
                                    {info.imageLinks.smallThumbnail && (
                                        <Image
                                            src={info.imageLinks.smallThumbnail}
                                            alt={info.title}
                                            className="w-full h-96 object-cover rounded"
                                            width={100}
                                            height={100}
                                        />
                                    )}
                                    <h2 className="text-2xl font-bold mt-4">{info.title}</h2>
                                    <p className="text-gray-600">by {info.authors.join(",")}</p>
                                    <p className="mt-2">{info.description.substring(0, 150) + "..."}</p>
                                    <div className="mt-4">
                                        <span className="text-sm font-semibold">Tags: </span>
                                        {info.categories.map((tag) => (
                                            <span key={tag} className="text-sm bg-gray-200 rounded-full px-2 py-1 mr-2">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-4 flex justify-between items-center">
                                        <span className="text-sm">Pages: {info.pageCount}</span>
                                        <span className="text-sm">Rating: {info.averageRating}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default BookRegister;
