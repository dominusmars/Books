"use client";
import { BookDocument } from "@/db/db";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import Qrcode from "./Qrcode";
function BookCard({ book, borrowable, origin, fullView }: { book: BookDocument; borrowable?: boolean; origin?: string; fullView?: boolean }) {
    if (fullView) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-sm hover:bg-slate-400 flex">
                <Image src={book.img} alt={book.title} className="w-full object-cover rounded" width={100} height={100} />
                <div className="p-4 ">
                    <Link href={"/book/view/" + book.id}>
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
                    </Link>

                    <div className="mt-6 flex justify-center items-center flex-col gap-5">
                        {borrowable && (
                            <>
                                <Link href={"/book/borrow/" + book.id}>
                                    <button className="inline-flex items-center justify-center h-12 gap-2 px-6 text-sm font-medium tracking-wide text-white transition duration-300 rounded-full whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none">
                                        <span>Borrow</span>
                                    </button>
                                </Link>
                                <Qrcode str={"http://" + origin + "/book/borrow/" + book.id} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-sm hover:bg-slate-400">
            <Link href={"/book/view/" + book.id}>
                <Image src={book.img} alt={book.title} className="w-full h-96 object-cover rounded" width={100} height={100} />
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
            </Link>
            {fullView && (
                <div className="mt-6 flex justify-center items-center">
                    {borrowable && (
                        <Link href={"/book/borrow/" + book.id}>
                            <button className="inline-flex items-center justify-center h-12 gap-2 px-6 text-sm font-medium tracking-wide text-white transition duration-300 rounded-full whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none">
                                <span>Borrow</span>
                            </button>
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}

export default BookCard;
