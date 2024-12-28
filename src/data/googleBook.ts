import { google } from "googleapis";

export const books = google.books({ version: "v1", auth: process.env["GOOGLE_API_KEY"] })
