"use client";
import React from "react";
import { useRouter } from "next/navigation";

const DeleteBook = ({ book_id }: { book_id: string }) => {
    const router = useRouter();

    const handleClick = async () => {
        const response = await fetch("/api/book/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ book_id: book_id }),
        });

        const result = await response.json();
        router.push("/");
    };

    return (
        <button onClick={handleClick} className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Delete
        </button>
    );
};

export default DeleteBook;
