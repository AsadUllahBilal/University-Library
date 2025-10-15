"use server";

import { db } from "@/database/drizzle";
import { borrowRecords } from "@/database/schema";
import { eq } from "drizzle-orm";

/**
 * Update borrow status (BORROWED / RETURNED)
 */
export async function updateBorrowStatus(
  borrowId: string,
  status: "BORROWED" | "RETURNED"
) {
  try {
    await db
      .update(borrowRecords)
      .set({
        status,
        returnedDate: status === "RETURNED" ? new Date().toISOString() : null,
      })
      .where(eq(borrowRecords.id, borrowId));

    return { success: true };
  } catch (error) {
    console.error("Error updating borrow status:", error);
    return { success: false, error: "Failed to update borrow status" };
  }
}
