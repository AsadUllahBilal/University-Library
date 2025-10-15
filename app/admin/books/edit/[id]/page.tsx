import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq } from "drizzle-orm";
import BookForm from "@/components/admin/forms/BookForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditBookPage({
  params,
}: {
  params: { id: string };
}) {
  const book = await db.query.books.findFirst({
    where: eq(books.id, params.id),
  });

  if (!book) return <p>Book not found</p>;

  return (
    <section className="w-full p-7">
      <Link href={`/admin/books/${params.id}`}>
        <Button className="bg-white hover:bg-gray-50 cursor-pointer shadow transition-all duration-300">
          <ArrowLeft />
          Go Back
        </Button>
      </Link>
      <div className="w-full max-w-7xl mt-8">
        <BookForm type="update" {...book} />
      </div>
    </section>
  );
}
