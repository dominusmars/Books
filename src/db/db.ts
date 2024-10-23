import { open } from "lmdb";
import * as lmdb from "lmdb";

import crypto, { randomUUID } from "crypto";
import fs from "fs";
import { getSHA256Hash } from "@/utils/hash";
import { addDays } from "@/utils/date";
import { books_v1, google, GoogleApis } from "googleapis";
import { delay } from "@/utils/delay";

export interface BookDocument {
    id: string;
    title: string;
    author: string;
    description: string;
    tags: string[];
    img: string;
    qty: number;
    pageCount: number;
    rating: number;
}
export interface Book {
    id: string;
    title: string;
    author: string;
    description: string;
    tags: string[];
    img: string;
    qty: number;
    pageCount: number;
    rating: number;
    borrowable: boolean;
}

export interface Ticket {
    id: string;
    person: string;
    netid: string;
    dateExpired: string;
    dateBorrowed: string;
    emailAt: string;
    book: string;
    book_id: string;
}
interface BookTicket {
    ticket: Ticket;
    book: BookDocument | undefined;
}

class DB {
    private location: string;
    db: lmdb.RootDatabase<any, lmdb.Key>;
    emailAt;
    tickets: lmdb.Database<Ticket, lmdb.Key>;
    expired_tickets: lmdb.Database<Ticket, lmdb.Key>;
    books: lmdb.Database<BookDocument, lmdb.Key>;
    googleBooks: books_v1.Books;
    constructor() {
        this.location = "./db";
        if (fs.existsSync(this.location)) {
            if (!fs.statSync(this.location).isDirectory()) {
                fs.mkdirSync(this.location);
            }
        }
        this.db = open({
            path: this.location,
            compression: true,
            // valueEncoding: "json",
        });
        this.tickets = this.db.openDB({ name: "tickets" });
        this.expired_tickets = this.db.openDB({ name: "expired_tickets" });

        this.books = this.db.openDB({ name: "books" });
        this.googleBooks = google.books({ version: "v1", auth: process.env["GOOGLE_API_KEY"] });
    }

    async _callExpiredTicket(ticket: Ticket) {
        // Email Netid To return book
    }
    async _checkTicketsForExpired() {
        const tickets = await this.getTickets();

        const date = new Date().getTime();

        for (let i = 0; i < tickets.length; i++) {
            const ticket = tickets[i];
            const ticketDate = new Date(ticket.dateExpired).getTime();
            if (date < ticketDate) continue;

            const emailedAt = new Date(ticket.emailAt).getTime();
            if (date < emailedAt) continue;
            // Email Person
        }
    }

    async _getBook(book: string): Promise<BookDocument> {
        const id = getSHA256Hash(book);

        const bookDoc = this.books.get(id);
        if (!bookDoc) {
            throw new Error(`Unable to find book ${book}`);
        }
        return bookDoc;
    }
    async getBookById(id: string): Promise<Book> {
        const bookDoc = this.books.get(id);
        if (!bookDoc) {
            throw new Error(`Unable to find book id ${id}`);
        }
        const book: Book = { ...bookDoc, borrowable: await this._checkIfBookCanBeBorrowed(id) };

        return book;
    }

    async getBooks() {
        const books = [];
        for await (const { value } of this.books.getRange()) {
            books.push(value);
        }
        return books;
    }
    async removeBook(book_id: string) {
        await this.getBookById(book_id);
        await this.books.remove(book_id);

        const tickets = await this.getTicketsForBook(book_id);

        tickets.forEach((ticket) => {
            this.returnBook(ticket.id);
        });
    }
    async increaseQty(book_id: string) {
        const book = await this.getBookById(book_id);
        book.qty = book.qty + 1;
        await this.books.put(book_id, book);
    }
    async decreaseQty(book_id: string) {
        const book = await this.getBookById(book_id);
        if (book.qty <= 1) throw new Error("Unable to decrease qty below one");

        book.qty = book.qty - 1;
        await this.books.put(book_id, book);
    }
    async addBook(name: string, qty: number): Promise<BookDocument> {
        if (name.length > 1000) {
            throw new Error("title cannot be more then 10000 char");
        }

        // Check if book is in database
        const checkBook = await this.books.get(name);
        if (checkBook) throw new Error(`${name} already exists`);

        const id = getSHA256Hash(name);

        const googleRequest = await this.googleBooks.volumes.list({
            q: name,
        });
        if (!googleRequest.data.items || googleRequest.data.items?.length == 0) {
            throw new Error(`Unable to find book with name ${name}`);
        }
        const info = googleRequest.data.items[0].volumeInfo;
        const title = info?.title;
        const author = (info?.authors && info.authors.join(",")) || "Unknown";
        const description = info?.description || "None";
        const tags = info?.categories || [];
        const img = info?.imageLinks?.thumbnail || info?.imageLinks?.smallThumbnail || "None";
        const pageCount = info?.pageCount || 0;
        const rating = info?.averageRating || 0;

        if (!title) throw new Error(`No title found for ${name}`);

        const Book: BookDocument = {
            author: author,
            description: description,
            title: title,
            qty: qty,
            id: id,
            tags: tags,
            img: img,
            rating: rating,
            pageCount: pageCount,
        };

        await this.books.put(id, Book);
        return Book;
    }

    async getTickets() {
        const tickets = [];
        for await (const { value } of this.tickets.getRange()) {
            tickets.push(value);
        }

        return tickets;
    }
    async getTicketsForBook(book_id: string) {
        const tickets = [];
        for await (const { value } of this.tickets.getRange()) {
            if (!(value.book_id == book_id)) continue;

            tickets.push(value);
        }

        return tickets;
    }
    async getTicket(ticket_id: string) {
        const ticket = this.tickets.get(ticket_id);
        if (!ticket) {
            throw new Error(`Unable to find ticket ${ticket_id}`);
        }
        return ticket;
    }
    async _getTicketWithBook(book_id: string) {
        const tickets = [];
        for await (const { value } of this.tickets.getRange()) {
            if (!(value.book_id == book_id)) continue;

            tickets.push(value);
        }

        return tickets;
    }

    async getBookTicketsByNetID(netid: string): Promise<BookTicket[]> {
        const booktickets = [];
        for await (const { value } of this.tickets.getRange()) {
            if (!(value.netid == netid)) continue;

            const book = this.books.get(value.book_id);
            if (!book) {
                console.log(`unable to find book ${value.book_id} ${value.book}`);
            }

            booktickets.push({
                book: book,
                ticket: value,
            });
        }

        return booktickets;
    }
    async _checkIfBookCanBeBorrowed(book_id: string) {
        const book = await this.books.get(book_id);
        if (!book) {
            throw new Error("Unable to find book by id");
        }

        const tickets = await this._getTicketWithBook(book_id);
        return tickets.length < book.qty;
    }

    async borrowBook(book_id: string, personsName: string, netid: string): Promise<Ticket> {
        const book = await this.getBookById(book_id);

        if (!(await this._checkIfBookCanBeBorrowed(book_id))) {
            throw new Error("Book cannot be borrowed already checked out");
        }

        const ticket: Ticket = {
            book: book.title,
            book_id: book_id,
            dateBorrowed: new Date().toISOString(),
            dateExpired: addDays(new Date(), 14).toISOString(),
            id: randomUUID(),
            netid: netid,
            person: personsName,
            emailAt: addDays(new Date(), 14).toISOString(),
        };

        await this.tickets.put(ticket.id, ticket);
        return ticket;
    }
    async returnBook(ticket_id: string) {
        const ticket = await this.getTicket(ticket_id);
        if (!ticket) {
            throw new Error("Unable to find ticket");
        }

        await this.tickets.remove(ticket_id);
        await this.expired_tickets.put(ticket_id, ticket);
    }

    async extendTicket(ticket_id: string) {
        const ticket = await this.getTicket(ticket_id);
        if (!ticket) {
            throw new Error("Unable to find ticket");
        }
        const newDate = addDays(new Date(), 14);
        ticket.dateExpired = newDate.toISOString();

        await this.tickets.put(ticket_id, ticket);
    }
}

const db = new DB();

export default db;
