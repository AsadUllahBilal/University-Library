"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import BookCover from "@/components/BookCover";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { deleteBook } from "@/lib/actions/book";
import { truncate } from "@/lib/utils";

interface BookInfo {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverColor: string;
  coverUrl: string;
  createdAt: Date | null;
}

export const columns: ColumnDef<BookInfo>[] = [
  {
    id: "bookName",
    header: "Book Title",
    cell: ({ row }) => {
      const bookTitle = truncate(row.original.title, 30);
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
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => {
      const author = row.getValue("author") as string;
      return <div className="font-medium">{author}</div>;
    },
  },
  {
    accessorKey: "genre",
    header: "Genre",
    cell: ({ row }) => {
      const genreBook = row.getValue("genre") as string;
      return <div className="font-medium">{genreBook}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date | null;
      return (
        <div className="text-sm">
          {date ? new Date(date).toLocaleDateString() : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const book = row.original;
      const router = useRouter();

      const handleEdit = () => {
        router.push(`/admin/books/edit/${book.id}`);
      };

      const handleDelete = async () => {
        const result = await deleteBook(book.id);

        if (result.success) {
          toast.success("Book deleted successfully");
          // Optional: refresh page or revalidate data
          window.location.reload();
        } else {
          toast.error("Failed to delete Book");
        }
      };

      const handleView = () => {
        router.push(`/admin/books/${book.id}`);
      };

      return (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 cursor-pointer"
            title="View Book"
            onClick={handleView}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            title="Edit Book"
            onClick={handleEdit}
            className="bg-transparent hover:bg-transparent text-blue-600 cursor-pointer"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="text-red-600 cursor-pointer">
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete this book?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                  onClick={handleDelete}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];
