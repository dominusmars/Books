import db from "@/db/db"

export default async function Page({ params }: { params: { book_id: string } }) {
    let book = await db.getBookById(params.book_id)
    

    return <div>My Post: {params.book_id}</div>
  }