import { sql } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { books, users, STATUS_ENUM, borrowRecords } from "@/database/schema";
import { eq, or } from "drizzle-orm";

export const getPendingUsers = async () => {
  try {
    const allUsers = await db
      .select()
      .from(users)
      .where(
        or(
          eq(users.status, STATUS_ENUM.enumValues[0]),
          eq(users.status, STATUS_ENUM.enumValues[2])
        )
      );

    return { success: true, data: allUsers };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, error: "Failed to fetch users" };
  }
};

export const getAllBooks = async () => {
  try {
    const allBooks = await db.select().from(books);
    return { success: true, data: allBooks };
  } catch (error: any) {
    console.error("Error fetching Books:", error);
    return { success: false, error: "Failed to fetch Books." };
  }
};

export const getAllUsers = async () => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        name: users.fullName,
        email: users.email,
        dateJoined: users.createdAt,
        universityId: users.universityId,
        universityCard: users.universityCard,
        role: users.role,
        booksBorrowed: sql<number>`COUNT(${borrowRecords.id})`.as(
          "booksBorrowed"
        ),
      })
      .from(users)
      .leftJoin(borrowRecords, eq(users.id, borrowRecords.usersId))
      .where(eq(users.status, STATUS_ENUM.enumValues[1]))
      .groupBy(users.id);

    return { success: true, data: allUsers };
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return { success: false, error: "Failed to fetch Users." };
  }
};

export async function getBorrowedBooksWithDetails() {
  try {
    const borrowedBooks = await db
      .select()
      .from(borrowRecords)
      .where(or(
        eq(borrowRecords.status, "BORROWED"),
        eq(borrowRecords.status, "RETURNED"),
      ))
      .orderBy(borrowRecords.createdAt)
      .limit(200);

    if (!borrowedBooks.length) return { data: [] };

    const detailedBooks = await Promise.all(
      borrowedBooks.map(async (record) => {
        const [book] = await db
          .select({
            id: books.id,
            title: books.title,
            coverUrl: books.coverUrl,
            coverColor: books.coverColor,
            createdAt: books.createdAt,
          })
          .from(books)
          .where(eq(books.id, record.booksId))
          .limit(1);

        const [user] = await db
          .select({
            fullName: users.fullName,
            email: users.email,
          })
          .from(users)
          .where(eq(users.id, record.usersId))
          .limit(1);

        return {
          borrowId: record.id,
          status: record.status,
          borrowedDate: record.createdAt,
          dueDate: record.dueDate,
          returnedDate: record.returnedDate,
          bookId: book?.id || "",
          title: book?.title || "Unknown Title",
          coverUrl: book?.coverUrl || "",
          coverColor: book?.coverColor || "#ccc",
          createdAt: book?.createdAt || null,
          fullName: user?.fullName || "Unknown User",
          email: user?.email || "N/A",
        };
      })
    );

    return { data: detailedBooks };
  } catch (error) {
    console.warn("Error fetching borrowed books:", error);
    return { data: [] };
  }
}
