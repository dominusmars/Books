"use client";
import React from "react";
import { useRouter } from "next/navigation";
const DecreaseQty = ({ book_id }: { book_id: string }) => {
    const router = useRouter();
    const handleClick = async () => {
        try {
            const response = await fetch("/api/book/qty/decrease", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ book_id: book_id }),
            });

            const result = await response.json();
            router.refresh();
        } catch (error) {}
    };

    return (
        <button onClick={handleClick} className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Decrease Qty
        </button>
    );
};

export default DecreaseQty;
