"use server";

import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { eq, sql } from "drizzle-orm";
import daysjs from "dayjs";

export const borrowBook = async (params: BorrowBookParams) => {
  const { userId, bookId } = params;

  try {
    // First, validate user exists and is approved
    const user = await db
      .select({ id: users.id, status: users.status })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.length) {
      return {
        success: false,
        error: "User not found.",
      };
    }

    if (user[0].status !== "APPROVED") {
      return {
        success: false,
        error:
          "You are not eligible to borrow books. Please wait for approval.",
      };
    }

    // Check if book exists and is available
    const book = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book.length || book[0].availableCopies <= 0) {
      return {
        success: false,
        error: "Book is not available for borrowing.",
      };
    }

    const dueDate = daysjs().add(7, "day").format("YYYY-MM-DD");

    const record = await db.insert(borrowRecords).values({
      usersId: userId,
      booksId: bookId,
      dueDate,
      returnedDate: new Date().toISOString().split("T")[0], // Set to current date as placeholder
      status: "BORROWED",
    });

    await db
      .update(books)
      .set({ availableCopies: book[0].availableCopies - 1 })
      .where(eq(books.id, bookId));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(record)),
    };
  } catch (error) {
    console.error("Borrow book error:", error);

    // Check if it's a connection timeout error
    if (error instanceof Error && error.message.includes("fetch failed")) {
      return {
        success: false,
        error: "Database connection failed. Please try again.",
      };
    }

    return {
      success: false,
      error: "An error occurred while borrowing books.",
    };
  }
};

export async function returnBook(borrowId: string) {
  try {
    const borrowed = await db.query.borrowRecords.findFirst({
      where: (b, { eq }) => eq(b.id, borrowId),
    });

    if (!borrowed) {
      return { success: false, error: "Borrow record not found" };
    }

    if (borrowed.status === "RETURNED") {
      return { success: false, error: "Book already returned" };
    }

    // Update borrow record
    await db
      .update(borrowRecords)
      .set({
        status: "RETURNED",
        returnedDate: new Date().toISOString().split("T")[0],
      })
      .where(eq(borrowRecords.id, borrowId));

    // Update book availability
    await db
      .update(books)
      .set({ availableCopies: sql`${books.availableCopies} + 1` })
      .where(eq(books.id, borrowed.booksId));

    return { success: true };
  } catch (error) {
    console.error("Return book error:", error);
    return { success: false, error: "Failed to return book." };
  }
}

export const deleteBook = async (bookId: string) => {
  try {
    // Step 1: delete borrow records first
    await db.delete(borrowRecords).where(eq(borrowRecords.booksId, bookId));

    // Step 2: now delete the book itself
    await db.delete(books).where(eq(books.id, bookId));

    return {
      success: true,
      message: "Book deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting book:", error);
    return {
      success: false,
      error: "Failed to delete book.",
    };
  }
};