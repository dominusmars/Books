// pages/index.tsx
import db from "@/data/db";
import BookSearch from "../components/BookSearch"; // Adjust the import based on your file structure

const Home = async () => {
    const books = await db.getBooks();

    return <BookSearch books={books} />;
};

export default Home;
