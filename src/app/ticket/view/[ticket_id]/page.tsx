import db from "@/db/db"

export default async function Page({ params }: { params: { ticket_id: string } }) {
    let ticket = await db.getTicket(params.ticket_id)
    

    return <div>My Post: {params.ticket_id}</div>
  }