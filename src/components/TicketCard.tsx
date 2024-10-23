"use client";
import { Ticket } from "@/db/db";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { format } from "date-fns";
const TicketCard: React.FC<{ ticket: Ticket; adminView?: boolean }> = ({ ticket, adminView = false }) => {
    const router = useRouter();

    const [Errored, setErrored] = useState<string | false>(false);

    const handleReturnBook = async () => {
        try {
            const response = await fetch("/api/ticket/return/" + ticket.id, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ticket_id: ticket.id }),
            });
            const result = await response.json();
            console.log("Return book result:", result);
            router.push("/");
        } catch (error) {
            console.error("Error returning book:", error);
            setErrored("returning book:" + error);
        }
    };

    const handleExtendDate = async () => {
        try {
            const response = await fetch("/api/ticket/extend/" + ticket.id, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ticket_id: ticket.id }),
            });
            const result = await response.json();
            console.log("Extend date result:", result);
            router.push(window.location.href);
        } catch (error) {
            console.error("Error extending date:", error);
            setErrored("returning book:" + error);
        }
    };

    return (
        <div className="bg-white border rounded-lg shadow-md p-6 m-4">
            <h2 className="text-xl font-semibold mb-2">{ticket.book}</h2>
            <p className="text-gray-700">
                <strong>Person:</strong> {ticket.person}
            </p>
            <p className="text-gray-700">
                <strong>NetID:</strong> {ticket.netid}
            </p>
            <p className="text-gray-700">
                <strong>Book:</strong> {ticket.book}
            </p>
            <p className="text-gray-700">
                <strong>Date Borrowed:</strong> {format(ticket.dateBorrowed, "MMMM d yyyy")}
            </p>
            <p className="text-gray-700">
                <strong>Date Expired:</strong> {format(ticket.dateExpired, "MMMM d yyyy")}
            </p>
            {adminView && (
                <>
                    <p className="text-gray-700">
                        <strong>Email At:</strong> {format(ticket.emailAt, "MMMM d yyyy HH:MM")}
                    </p>
                    <p className="text-gray-700 text-wrap">
                        <strong>Book Id:</strong> {ticket.book_id}
                    </p>
                </>
            )}
            <p className="text-gray-700">
                <strong>Ticket ID:</strong> {ticket.id}
            </p>
            {Errored && (
                <p className="text-red-700">
                    <strong>Errored:</strong> {Errored}
                </p>
            )}
            <div className="flex space-x-4 mt-4">
                <button onClick={handleReturnBook} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Return Book
                </button>
                <button onClick={handleExtendDate} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Extend Date
                </button>
                <Link href={"/ticket/view/" + ticket.id}>
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">View</button>
                </Link>
            </div>
        </div>
    );
};

export default TicketCard;
