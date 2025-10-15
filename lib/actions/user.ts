"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

export const approveUser = async (userId: string) => {
  try {
    await db
      .update(users)
      .set({ status: "APPROVED" })
      .where(eq(users.id, userId));

    return {
      success: true,
      message: "User approved successfully.",
    };
  } catch (error) {
    console.error("Error approving user:", error);
    return {
      success: false,
      error: "Failed to approve user.",
    };
  }
};

export const rejectUser = async (userId: string) => {
  try {
    await db
      .update(users)
      .set({ status: "REJECTED" })
      .where(eq(users.id, userId));

    return {
      success: true,
      message: "User rejected successfully.",
    };
  } catch (error) {
    console.error("Error rejecting user:", error);
    return {
      success: false,
      error: "Failed to reject user.",
    };
  }
};

export async function changeUserRole(
  userId: string,
  newRole: "USER" | "ADMIN"
) {
  try {
    const result = await db
      .update(users)
      .set({ role: newRole })
      .where(eq(users.id, userId));

    if (!result) {
      throw new Error("No rows updated");
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to update role:", error);
    return { success: false, error: "Failed to update role" };
  }
}

export const deleteUser = async (userId: string) => {
  try {
    // Delete the user where ID matches
    await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning();

    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      message: "Failed to delete user",
    };
  }
};