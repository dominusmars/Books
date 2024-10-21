import { Level } from "level"
import { AbstractSublevel } from "abstract-level";
import crypto, { randomUUID } from "crypto";
import { books } from "@googleapis/books";
import fs from 'fs'
import { getSHA256Hash } from "@/utils/hash";
import { addDays } from "@/utils/date";

const googleBooks =  books('v1')

interface BookDocument {
    id: string;
    title: string;
    author: string;
    description:string;
    tags: string[]
    img: string;
    qty: number;
    pageCount: number;
    rating:number;
}
interface Book {
    id: string;
    title: string;
    author: string;
    description:string;
    tags: string[]
    img: string;
    qty: number;
    pageCount: number;
    rating:number;
    borrowable:boolean;
}

interface Ticket {
    id: string,
    person: string;
    netid: string;
    dateExpired: string;
    dateBorrowed:string;
    emailAt:string;
    book: string;
    book_id: string;
}
interface BookTicket {
    ticket: Ticket
    book: BookDocument
}


class DB {
    private location: string;
    db: Level<string, any>;
    tickets: AbstractSublevel<Level<string, any>, string | Buffer | Uint8Array, string, Ticket>;
    books: AbstractSublevel<Level<string, any>, string | Buffer | Uint8Array, string, BookDocument>;
    constructor() {
        this.location = "./db"
        if (fs.existsSync(this.location)) {
            if (!fs.statSync(this.location).isDirectory()) {
                fs.mkdirSync(this.location);
            }
        }
        this.db = new Level(this.location, {
            'valueEncoding': "json"
        })
        this.tickets = this.db.sublevel("_tickets", {
            'valueEncoding': 'json'
        })
        this.books = this.db.sublevel("_books", {
            'valueEncoding': 'json'
        })
    }
    async _callExpiredTicket(ticket:Ticket){
        // Email Netid To return book
    }
    async _checkTicketsForExpired(){
        let tickets = await this.getTickets()

        let date = new Date().getTime()
        
        for (let i = 0; i < tickets.length; i++) {
            const ticket = tickets[i];
            let ticketDate = new Date(ticket.dateExpired).getTime()
            if(date < ticketDate) continue

            let emailedAt = new Date(ticket.emailAt).getTime()
            if(date < emailedAt) continue
            // Email Person


        }

    }

    async _getBook(book: string): Promise<BookDocument> {
        const id = getSHA256Hash(book)

        const bookDoc = await this.books.get(id).catch(() => false)
        if (typeof bookDoc == 'boolean' || !bookDoc) {
            throw new Error(`Unable to find book ${book}`)
        }
        return bookDoc
    }
    async getBookById(id: string): Promise<Book> {
        const bookDoc = await this.books.get(id).catch(() => false)
        if (typeof bookDoc == 'boolean' || !bookDoc) {
            throw new Error(`Unable to find book id ${id}`)
        }
        let book:Book = {...bookDoc,borrowable: await this._checkIfBookCanBeBorrowed(id) }

        return book
    }

    async getBooks() {
        let books = []
        for await (const [key, book] of this.books.iterator()) {
            if (
                key.includes("_tickets")
            )
                continue;


            books.push(book)

        }
        return books
    }
    async removeBook(book_id:string){
        await this.getBookById(book_id);
        await this.books.del(book_id)
    }
    async increaseQty(book_id:string){
        let book = await this.getBookById(book_id);
        book.qty = book.qty +1;
        await this.books.put(book_id, book)
    }
    async decreaseQty(book_id:string){
        let book = await this.getBookById(book_id);
        if(book.qty == 1) throw new Error("Unable to decrease qty below one")
        
        book.qty = book.qty -1;
        await this.books.put(book_id, book)
    }
    async addBook(name: string, qty:number){

        if(name.length > 1000){
            throw new Error("title cannot be more then 10000 char")
        }

        // Check if book is in database
        let checkBook = await this.books.get(name).catch(()=> false)
        if(checkBook) throw new Error(`${name} already exists`)

        let id = getSHA256Hash(name)

        const googleRequest = await googleBooks.volumes.list({ 
            q: name
        })
        if(!googleRequest.data.items || googleRequest.data.items?.length == 0){
            throw new Error(`Unable to find book with name ${name}`)
        }
        const info = googleRequest.data.items[0].volumeInfo
        const title = info?.title 
        const author = (info?.authors && info.authors.join(",")) || "Unknown"
        const description = info?.description || "None"
        const tags = info?.categories || [] 
        const img = info?.imageLinks?.thumbnail || info?.imageLinks?.smallThumbnail || "None"
        const pageCount = info?.pageCount || 0
        const rating = info?.averageRating || 0

        if(!title) throw new Error(`No title found for ${name}`)

        const Book:BookDocument = {
            'author':author,
            description: description,
            'title':title,
            'qty':qty,
            'id': id,
            tags: tags,
            img: img,
            rating: rating,
            pageCount: pageCount
        }

        await this.books.put(id,Book)

    }
  
    async getTickets(){
        let tickets = []
        for await (const [key, ticket] of this.tickets.iterator()) {
            if (
                key.includes("_books")
            )
                continue;
            tickets.push(ticket)

        }

        return tickets
    }
    async getTicket(ticket_id:string){
        const ticket = await this.tickets.get(ticket_id).catch(()=> false)
        if(typeof ticket == 'boolean' || !ticket ){
            throw new Error(`Unable to find ticket ${ticket_id}`)
        }
        return ticket
    }
    async _getTicketWithBook(book_id:string){
        let tickets = []
        for await (const [key, ticket] of this.tickets.iterator()) {
            if (
                key.includes("_books")
            )
                continue;

            if(!(ticket.book_id == book_id)) continue

            tickets.push(ticket)
        }

        return tickets
    }

    async getBookTicketsByNetID(netid: string): Promise<BookTicket[]> {
        let booktickets = []
        for await (const [key, ticket] of this.tickets.iterator()) {
            if (
                key.includes("_books")
            )
                continue;
            if (!(ticket.netid == netid)) continue


            const book= await this.books.get(ticket.book_id).catch(()=> false)
            if(typeof book == 'boolean' ||  !book) {
                console.log(`unable to find book ${ticket.book_id}`)
                continue
            }

            booktickets.push({
                book: book,
                ticket: ticket,
            })

        }

        return booktickets
    }
    async _checkIfBookCanBeBorrowed(book_id:string){
        let book = await this.books.get(book_id).catch(() => false)
        if(typeof book == 'boolean' || !book){
            throw new Error("Unable to find book by id")
        }

        let tickets = await this._getTicketWithBook(book_id);
        return tickets.length < book.qty
    }

    async borrowBook(book_id: string, personsName:string, netid:string): Promise<Ticket> {
        let book = await this.getBookById(book_id)

        if(!(await this._checkIfBookCanBeBorrowed(book_id))){
            throw new Error("Book cannot be borrowed already checked out")
        }
        
        let ticket:Ticket = {
            'book': book.title,
            'book_id':book_id,
            'dateBorrowed': new Date().toISOString(),
            'dateExpired': addDays(new Date(), 14).toISOString(),
            'id': randomUUID(),
            'netid': netid,
            'person': personsName,
            'emailAt':  addDays(new Date(), 14).toISOString()
        }

       await this.tickets.put(ticket.id, ticket)
       return ticket
    }
    async returnBook(ticket_id: string) {
        let ticket = await this.getTicket(ticket_id);
        if(typeof ticket == 'boolean' && !ticket){
            throw new Error("Unable to find ticket")
        }

        await this.tickets.del(ticket_id)
    }

    async extendTicket(ticket_id: string) {
        let ticket = await this.getTicket(ticket_id);
        if(typeof ticket == 'boolean' && !ticket){
            throw new Error("Unable to find ticket")
        }
        let newDate = addDays(new Date(), 14);
        ticket.dateExpired = newDate.toISOString()

        await this.tickets.put(ticket_id, ticket)
    }
}


const db = new DB()

export default db