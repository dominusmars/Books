"use client";

import { useState } from "react";

export default function Page() {
    const [title, setTitle] = useState("");
    const [qty, setQty] = useState<number | "">("");
    const [Errored, setError] = useState<string | boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("qty", qty.toString());

        try {
            const response = await fetch("/api/book/register", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to register book");
            }

            const result = await response.json();
            console.log("Book registered:", result);
        } catch (error: any) {
            setError(error?.message);
            console.error("Error:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
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
                <div className="mb-4">
                    <label htmlFor="qty" className="block text-gray-700">
                        Quantity
                    </label>
                    <input
                        type="number"
                        id="qty"
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                {Errored && <div className="md-4 text-red-800">{Errored}</div>}
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Submit
                </button>
            </form>
        </div>
    );
}
