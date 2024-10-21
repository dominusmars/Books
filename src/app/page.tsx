import db from "@/db/db";
import Image from "next/image";

export default async function Home() {

  let books = await db.getBooks()

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">Book List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {books.map((book) => (
          <div key={book.id} className="bg-white p-4 rounded-lg shadow-lg">
            <img src={book.img} alt={book.title} className="w-full h-48 object-cover rounded" />
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
        ))}
      </div>
    </div>
  );
}
