"use client";
import { redirect } from "next/navigation";
// components/FormComponent.js
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function BorrowForm({ book_id }: { book_id: string }) {
    const [name, setName] = useState("");
    const [netid, setNetid] = useState("");
    const [Errored, setErrored] = useState<string | false>(false);
    const router = useRouter();
    const handleSubmit = async (e: { preventDefault: () => void }) => {
        try {
            e.preventDefault();

            const formData = new FormData();
            formData.append("name", name);
            formData.append("netid", netid);
            formData.append("book_id", book_id);

            const response = await fetch("/api/book/borrow", {
                method: "POST",
                body: formData,
            });
            if (!response.ok) {
                throw new Error("Failed to borrow book");
            }
            const result = await response.json();
            router.push("/ticket/view/" + result.ticket.id);
        } catch (error) {
            if (error instanceof Error) setErrored(error.message);
            else console.log(error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="netid">
                        NetID
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="netid"
                        type="text"
                        placeholder="Net Id"
                        value={netid}
                        onChange={(e) => setNetid(e.target.value)}
                    />
                </div>
                {Errored && <div className="md-4 text-red-800">{Errored}</div>}
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Borrow
                    </button>
                </div>
            </form>
        </div>
    );
}
