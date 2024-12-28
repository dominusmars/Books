import { open } from "lmdb";
import * as lmdb from "lmdb";

import { randomUUID } from "crypto";
import fs from "fs";
import { addDays } from "@/utils/date";
import { books_v1, google } from "googleapis";
import { BookEntity } from "./book";
import { TicketEntity } from "./ticket";
import { UserEntity, UserDocument } from "./User";
import bcrypt from "bcrypt";

export interface AdminDocument {
    username: string;
    password: string;
    email: string;
    createdAt: number;
}
export interface AdminJWT extends Omit<AdminDocument, "password" | "email"> {}
export interface BookDocument {
    id: string;
    title: string;
    author: string;
    description: string;
    tags: string[];
    img: string;
    pageCount: number;
    rating: number;
    borrowable?: boolean;
}
export interface Book extends BookDocument {
    canBorrow(): Promise<boolean>;
    borrow(personName: string, netId: string): Promise<Ticket>;
    remove(): Promise<void>;
    toJson(): BookDocument;
}

export interface TicketDocument {
    id: string;
    personName: string;
    netid: string;
    dateExpired: string;
    dateBorrowed: string;
    emailAt: string;
    book: string;
    book_id: string;
}
export interface Ticket extends TicketDocument {
    extend(): Promise<void>;
    return(): Promise<void>;
    toJson(): TicketDocument;
}
export interface BookTicket {
    ticket: Ticket;
    book: Book | null;
}

class DB {
    private location: string;
    db: lmdb.RootDatabase<unknown, lmdb.Key>;
    tickets: lmdb.Database<TicketDocument, lmdb.Key>;
    expired_tickets: lmdb.Database<TicketDocument, lmdb.Key>;
    books: lmdb.Database<BookDocument, lmdb.Key>;
    admin: lmdb.Database<AdminDocument, lmdb.Key>;
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
        });
        this.tickets = this.db.openDB({ name: "tickets" });
        this.expired_tickets = this.db.openDB({ name: "expired_tickets" });

        this.books = this.db.openDB({ name: "books" });
        this.admin = this.db.openDB({ name: "admin" });
        this.initAdminUser();
    }
    async initAdminUser() {
        if (!(process.env["INIT_ADMIN_USERNAME"] && process.env["INIT_ADMIN_PASSWORD"])) return;
        const username = process.env["INIT_ADMIN_USERNAME"];
        const password = process.env["INIT_ADMIN_PASSWORD"];
        const email = process.env["INIT_ADMIN_EMAIL"];
        const checkAdminUser = await this.admin.get(username);
        if (checkAdminUser) return;

        !email && console.warn("admin email not set");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const adminUser: AdminDocument = {
            username: username,
            password: hashedPassword,
            email: email || "none",
            createdAt: new Date().getTime(),
        };

        const result = await this.admin.put(adminUser.username, adminUser);
        if (!result) throw new Error("unable to init admin user");
    }

    async login(username: string, password: string) {
        const user = await this.admin.get(username);
        if (!user) throw new Error("Unable to find admin user");
        const result = await bcrypt.compare(password, user.password);
        if (!result) {
            throw new Error("Invalid password");
        }
        return user;
    }

    getUser(ticket: TicketDocument): UserEntity;
    getUser(ticket: Ticket) {
        const username = ticket.personName;
        const netId = ticket.netid;
        return new UserEntity(username, netId);
    }

    // async _callExpiredTicket(ticket: Ticket) {
    //     // Email Netid To return book
    // }

    async _checkTicketsForExpired() {
        const tickets = await this.getTickets();

        const date = new Date().getTime();

        for (let i = 0; i < tickets.length; i++) {
            const ticket = tickets[i];
            const ticketDate = new Date(ticket.dateExpired).getTime();
            if (date < ticketDate) continue;

            const emailedAt = new Date(ticket.emailAt).getTime();
            if (date < emailedAt) continue;

            const user = this.getUser(ticket);

            // Email Person
        }
    }

    async getBookById(book_id: string): Promise<Book> {
        const bookDoc = this.books.get(book_id);
        if (!bookDoc) {
            throw new Error(`Unable to find book id ${book_id}`);
        }
        const book: Book = new BookEntity(bookDoc);

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

    async addBook(book: books_v1.Schema$Volume): Promise<BookDocument> {
        const info = book.volumeInfo;
        const title = info?.title;
        const author = (info?.authors && info.authors.join(",")) || "Unknown";
        const description = info?.description || "None";
        const tags = info?.categories || [];
        const img = info?.imageLinks?.thumbnail || info?.imageLinks?.smallThumbnail || "None";
        const pageCount = info?.pageCount || 0;
        const rating = info?.averageRating || 0;

        const id = randomUUID();

        if (!title) throw new Error(`No title found for ${book.etag}`);

        const Book: BookDocument = {
            author: author,
            description: description,
            title: title,
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
    async getTicketById(ticket_id: string) {
        const ticket = this.tickets.get(ticket_id);
        if (!ticket) {
            throw new Error(`Unable to find ticket ${ticket_id}`);
        }
        return new TicketEntity(ticket);
    }

    async _getTicketWithBook(book_id: string) {
        const tickets = [];
        for await (const { value } of this.tickets.getRange()) {
            if (!(value.book_id == book_id)) continue;

            tickets.push(value);
        }

        return tickets;
    }
    async getBookTickets() {
        const bookTickets: BookTicket[] = [];
        for await (const { value } of this.tickets.getRange()) {
            const book = this.books.get(value.book_id);
            if (!book) {
                console.log(`unable to find book ${value.book_id} ${value.book}`);
            }

            bookTickets.push({
                book: book ? new BookEntity(book) : null,
                ticket: new TicketEntity(value),
            });
        }

        return bookTickets;
    }
    async getBookTicketsByNetID(netid: string): Promise<BookTicket[]> {
        const bookTickets: BookTicket[] = [];
        for await (const { value } of this.tickets.getRange()) {
            if (!(value.netid == netid)) continue;

            const book = this.books.get(value.book_id);
            if (!book) {
                console.log(`unable to find book ${value.book_id} ${value.book}`);
            }

            bookTickets.push({
                book: book ? new BookEntity(book) : null,
                ticket: new TicketEntity(value),
            });
        }

        return bookTickets;
    }
    async checkIfBookCanBeBorrowed(book_id: string) {
        const book = await this.books.get(book_id);
        if (!book) {
            throw new Error("Unable to find book by id");
        }

        const tickets = await this._getTicketWithBook(book_id);
        return tickets.length == 0;
    }

    async borrowBook(book: Book, personsName: string, netid: string): Promise<Ticket> {
        if (!(await db.checkIfBookCanBeBorrowed(book.id))) {
            throw new Error("Book cannot be borrowed already checked out");
        }

        const ticket: Ticket = new TicketEntity({
            book: book.title,
            book_id: book.id,
            dateBorrowed: new Date().toISOString(),
            dateExpired: addDays(new Date(), 14).toISOString(),
            id: randomUUID(),
            netid: netid,
            personName: personsName,
            emailAt: addDays(new Date(), 14).toISOString(),
        });

        await this.tickets.put(ticket.id, ticket);
        return ticket;
    }
    async returnBook(ticket_id: string) {
        const ticket = await this.getTicketById(ticket_id);
        if (!ticket) {
            throw new Error("Unable to find ticket");
        }

        this.tickets.removeSync(ticket_id);
        await this.expired_tickets.putSync(ticket_id, ticket);
    }

    async extendTicket(ticket_id: string) {
        const ticket = await this.getTicketById(ticket_id);
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
