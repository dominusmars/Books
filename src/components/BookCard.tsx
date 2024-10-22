"use client";
import { BookDocument } from "@/db/db";
import Link from "next/link";
import React from "react";

function BookCard({ book }: { book: BookDocument }) {
    return (
        <Link href={"/book/view/" + book.id}>
            <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-sm hover:bg-slate-400">
                <img src={book.img} alt={book.title} className="w-full h-96 object-cover rounded" />
                <h2 className="text-2xl font-bold mt-4">{book.title}</h2>
                <p className="text-gray-600">by {book.author}</p>
                <p className="mt-2">{book.description}</p>
                <div className="mt-4">
                    <span className="text-sm font-semibold">Tags: </span>
                    {book.tags.map((tag) => (
                        <span key={tag} className="text-sm bg-gray-200 rounded-full px-2 py-1 mr-2">
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm">Pages: {book.pageCount}</span>
                    <span className="text-sm">Qty: {book.qty}</span>
                    <span className="text-sm">Rating: {book.rating}</span>
                </div>
            </div>
        </Link>
    );
}

export default BookCard;
