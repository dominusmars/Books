import db, { Ticket, TicketDocument } from "./db";

export class TicketEntity implements Ticket {
    id: string;
    personName: string;
    netid: string;
    dateExpired: string;
    dateBorrowed: string;
    emailAt: string;
    book: string;
    book_id: string;
    constructor(ticket: TicketDocument) {
        this.id = ticket.id;
        this.personName = ticket.personName;
        this.netid = ticket.netid;
        this.dateExpired = ticket.dateExpired;
        this.dateBorrowed = ticket.dateBorrowed;
        this.emailAt = ticket.emailAt;
        this.book = ticket.book;
        this.book_id = ticket.book_id;
    }

    extend(): Promise<void> {
        return db.extendTicket(this.id);
    }
    return(): Promise<void> {
        return db.returnBook(this.id);
    }
    toJson(): TicketDocument {
        return {
            id: this.id,
            personName: this.personName,
            netid: this.netid,
            dateExpired: this.dateExpired,
            dateBorrowed: this.dateBorrowed,
            emailAt: this.emailAt,
            book: this.book,
            book_id: this.book_id,
        };
    }
}
