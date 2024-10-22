"use client";
import React from "react";

const DecreaseQty = ({ book_id }: { book_id: string }) => {
    const handleClick = async () => {
        const response = await fetch("/api/book/decreaseQty", {
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
            Decrease Qty
        </button>
    );
};

export default DecreaseQty;
