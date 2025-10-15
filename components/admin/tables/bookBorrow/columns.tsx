"use client";

import { ColumnDef } from "@tanstack/react-table";
import BookCover from "@/components/BookCover";
import { getInitials, truncate } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import React from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateBorrowStatus } from "@/lib/admin/actions/borrow"; // ✅ import the new action

interface BorrowedBookInfo {
  borrowId: string;
  status: string;
  borrowedDate: string | null;
  dueDate: string | null;
  returnedDate: string | null;
  bookId: string;
  title: string;
  coverUrl: string;
  coverColor: string;
  createdAt: Date | null;
  fullName: string;
  email: string;
}

export const columns: ColumnDef<BorrowedBookInfo>[] = [
  {
    id: "bookName",
    header: "Book Title",
    cell: ({ row }) => {
      const bookTitle = truncate(row.original.title, 20);
      const bookColor = row.original.coverColor;
      const bookCover = row.original.coverUrl;

      return (
        <span className="flex items-center justify-start gap-2">
          <BookCover
            coverColor={bookColor}
            variant="extraSmall"
            coverImage={bookCover}
          />
          <div>
            <h1 className="font-medium">{bookTitle}</h1>
          </div>
        </span>
      );
    },
  },
  {
    id: "userRequested",
    header: "User Requested",
    cell: ({ row }) => {
      const { fullName, email } = row.original;
      return (
        <span className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback className="bg-[#0C8CE9]">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-medium">{fullName}</h1>
            <p className="text-xs text-gray-400">{email}</p>
          </div>
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const [selectedStatus, setSelectedStatus] = React.useState(status);

      const handleStatusChange = async (newStatus: string) => {
        const previousStatus = selectedStatus;
        setSelectedStatus(newStatus);

        const result = await updateBorrowStatus(
          row.original.borrowId, // ✅ Correct borrow ID
          newStatus as "BORROWED" | "RETURNED"
        );

        if (result.success) {
          toast.success(`Book marked as ${newStatus}`);
        } else {
          toast.error("Failed to update status");
          setSelectedStatus(previousStatus);
        }
      };

      return (
        <Select value={selectedStatus} onValueChange={handleStatusChange}>
          <SelectTrigger className="border-none w-[120px]">
            <SelectValue placeholder={status} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BORROWED">Borrowed</SelectItem>
            <SelectItem value="RETURNED">Returned</SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "borrowedDate",
    header: "Borrowed On",
    cell: ({ row }) => (
      <div>{new Date(row.original.borrowedDate!).toLocaleDateString()}</div>
    ),
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => (
      <div>{new Date(row.original.dueDate!).toLocaleDateString()}</div>
    ),
  },
  {
    accessorKey: "returnedDate",
    header: "Returned Date",
    cell: ({ row }) => (
      <div>
        {row.original.returnedDate
          ? new Date(row.original.returnedDate).toLocaleDateString()
          : "Not returned"}
      </div>
    ),
  },
];