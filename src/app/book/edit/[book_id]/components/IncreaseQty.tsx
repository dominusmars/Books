"use client";
import React from "react";

const IncreaseQty = ({ book_id }: { book_id: string }) => {
    const handleClick = async () => {
        const response = await fetch("/api/book/increaseQty", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ book_id: book_id }),
        });

        const result = await response.json();
        console.log(result);
    };

    return (
        <button onClick={handleClick} className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Increase Qty
        </button>
    );
};

export default IncreaseQty;
