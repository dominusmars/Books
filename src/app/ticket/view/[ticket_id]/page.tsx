import BookCard from "@/components/BookCard";
import TicketCard from "@/components/TicketCard";
import db from "@/data/db";

export default async function Page({ params }: { params: { ticket_id: string } }) {
    const ticket = await db.getTicketById(params.ticket_id).catch(() => null);
    if (!ticket) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 text-black">
                <h1 className="text-2xl font-bold mt-4 mb-5"> Ticket Not Found</h1>
            </div>
        );
    }
    const book = await db.getBookById(ticket.book_id).catch(() => null);
    if (!book) {
        console.log("Book not found for ticket", ticket);
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 text-black">
                <h1 className="text-2xl font-bold mt-4 mb-5">Book Not Found</h1>
            </div>
        );
    }

    const otherTickets = (await db.getBookTicketsByNetID(ticket.netid)).filter((t) => t.ticket.id != ticket.id);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 text-black">
            <h1 className="text-2xl font-bold mt-4 mb-5"> {book.title} Ticket</h1>

            <div className="flex gap-10 justify-center items-center sm:flex-col md:flex-row xs:flex-col">
                <div className="item w-[30%]">
                    <BookCard book={book.toJson()} key={book.id} />
                </div>

                <TicketCard ticket={ticket.toJson()} />
            </div>

            <h1 className="text-2xl font-bold mt-4"> Other Active Tickets</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                {otherTickets.map((t) => {
                    return <TicketCard ticket={t.ticket.toJson()} key={t.ticket.id} />;
                })}
            </div>
        </div>
    );
}
