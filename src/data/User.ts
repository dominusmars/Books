import db, { BookTicket, Ticket } from "./db";
export interface UserDocument {
    name: string;
    netId: string;
    email: string;
    password: string;
    admin?: boolean;
}

interface User extends Omit<UserDocument, "password"> {
    name: string;
    netId: string;
    email: string;
    getTickets(): Promise<BookTicket[]>;
    sendVerifyEmail(): Promise<void>;
    sendBorrowedEmail(ticket: Ticket): Promise<void>;
    sendExpiredEmail(ticket: Ticket): Promise<void>;
}

export class UserEntity implements User {
    name: string;
    netId: string;
    email: string;
    constructor(username: string, netid: string) {
        this.name = username;
        this.netId = netid;
        this.email = this.netId + "@scarletmail.rutgers.edu";
    }
    toJson() {
        return {
            name: this.name,
            netId: this.netId,
            email: this.email,
        };
    }
    getTickets(): Promise<BookTicket[]> {
        return db.getBookTicketsByNetID(this.netId);
    }

    sendVerifyEmail(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    sendBorrowedEmail(ticket: Ticket): Promise<void> {
        throw new Error("Method not implemented.");
    }
    sendExpiredEmail(ticket: Ticket): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
