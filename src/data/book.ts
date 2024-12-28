import { BookDocument, Book } from "./db";
import db from "./db";

export class BookEntity implements Book {
    id: string;
    title: string;
    author: string;
    description: string;
    tags: string[];
    img: string;
    rating: number;
    pageCount: number;
    constructor(book: BookDocument) {
        this.id = book.id;
        this.title = book.title;
        this.author = book.author;
        this.description = book.description;
        this.tags = book.tags;
        this.img = book.img;
        this.rating = book.rating;
        this.pageCount = book.pageCount;
    }

    canBorrow(): Promise<boolean> {
        // might want to move canBorrow logic from db.ts to here
        return db.checkIfBookCanBeBorrowed(this.id);
    }
    async borrow(personName: string, netId: string) {
        // might want to move borrow logic from db.ts to here
        return db.borrowBook(this, personName, netId);
    }
    async remove(): Promise<void> {
        // might want to move remove logic from db.ts to here
        return db.removeBook(this.id);
    }
    toJson(): BookDocument {
        return {
            id: this.id,
            title: this.title,
            author: this.author,
            description: this.description,
            tags: this.tags,
            img: this.img,
            pageCount: this.pageCount,
            rating: this.rating,
        };
    }
}
