import db, { BookDocument } from "@/data/db";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import BookPages from "./components/BookPages";

export default async function AdminDashboardPage() {
    const user = await verifySession();
    if (!user) return redirect("/admin/login");

    const books = await db.getBooks();
    // Need to add a list of tickets and switch to the ticket page
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 text-black">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <h2 className="text-3xl font-bold mb-6">Welcome, {user.user.username}</h2>
            <BookPages books={books} />
        </div>
    );
}
