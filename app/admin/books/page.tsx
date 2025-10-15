import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BooksTable } from "@/components/admin/tables/allBooks/data-table";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc, like, or } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const Page = async ({ searchParams }: { searchParams: Promise<{ q?: string }> }) => {
  const params = await searchParams;
  const q = (params?.q || "").trim();
  let data: any[] = [];
  try {
    data = await db
      .select()
      .from(books)
      .where(
        q
          ? or(like(books.title, `%${q}%`), like(books.author, `%${q}%`))
          : undefined as any
      )
      .orderBy(desc(books.createdAt))
      .limit(200);
  } catch (e) {
    console.warn("Failed to fetch admin books:", e);
    data = [];
  }

  console.log("Admin books data:", { q, count: data.length, sample: data[0] });
  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">All Books</h2>
        <Button className="bg-admin-primary hover:bg-admin-primary/90 transition duration-300" asChild>
          <Link href="/admin/books/new" className="text-white">
            + Create a New Book
          </Link>
        </Button>
      </div>

      <div className="mt-7 w-full overflow-hidden">
        <BooksTable data={data} />
      </div>
    </section>
  );
};

export default Page;