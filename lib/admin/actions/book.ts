"use server";

import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq } from "drizzle-orm";

export const createBook = async (params: BookParams) => {
  try {
    const newBook = await db
      .insert(books)
      .values({
        ...params,
        availableCopies: params.totalCopies,
      })
      .returning();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newBook[0])),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Error creating book",
    };
  }
};

export const EditBook = async ({
  params,
  bookId,
}: {
  params: BookParams;
  bookId: string;
}) => {
  try {
    const editBook = await db
      .update(books)
      .set({
        ...params,
        availableCopies: params.totalCopies,
      })
      .where(eq(books.id, bookId))
      .returning();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(editBook[0])),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Error editing book",
    };
  }
};