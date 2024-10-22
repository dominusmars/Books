import { Ticket } from "@/db/db";
import React from "react";

const TicketCard: React.FC<{ ticket: Ticket, adminView?: boolean, }> = ({ ticket, adminView = false }) => {
    
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
                <strong>Date Borrowed:</strong> {ticket.dateBorrowed}
            </p>
            <p className="text-gray-700">
                <strong>Date Expired:</strong> {ticket.dateExpired}
            </p>
            {adminView && (
                <>
                 <p className="text-gray-700">
                    <strong>Email At:</strong> {ticket.emailAt}
                </p>
                <p className="text-gray-700 text-wrap">
                    <strong>Book Id:</strong> {ticket.book_id}
                </p>
                
                </>
               

            )}
            
            <p className="text-gray-700">
                <strong>Ticket ID:</strong> {ticket.id}
            </p>
        </div>
    );
};

export default TicketCard;
