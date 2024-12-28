import BookCard from "@/components/BookCard";
import db from "@/data/db";
// import DecreaseQty from "./components/DecreaseQty";
// import IncreaseQty from "./components/IncreaseQty";
import DeleteBook from "./components/DeleteBook";
import TicketCard from "@/components/TicketCard";
import { useAuth } from "@/lib/auth";

export default async function Page({ params }: { params: { book_id: string } }) {
    await useAuth();

    const book = await db.getBookById(params.book_id).catch(() => null);
    if (!book) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 text-black">
                <h1 className="text-2xl font-bold mt-4 mb-5">Book Not Found</h1>
            </div>
        );
    }

    const tickets = await db.getTicketsForBook(params.book_id);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 text-black">
            <h1 className="text-3xl font-bold mb-6">Edit: {book.title}</h1>
            <div className="flex gap-10 justify-center items-center sm:flex-col md:flex-row xs:flex-col">
                <div className="item w-[30%]">
                    <BookCard book={book.toJson()} key={book.id} />
                    <div className="flex flex-col justify-center items-center bg-gray-300 rounded shadow-sm p-4 m-2">
                        <DeleteBook book_id={book.id} />
                    </div>
                </div>
            </div>
            <h1 className="text-3xl font-bold mb-6">Active Tickets</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-8xl">
                {tickets.map((ticket) => {
                    return <TicketCard ticket={ticket} key={ticket.id} adminView />;
                })}
            </div>
        </div>
    );
}
