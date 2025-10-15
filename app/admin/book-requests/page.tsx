import React from "react";
import { getBorrowedBooksWithDetails } from "@/lib/getDataFromDB";
import { BookBorrowTable } from "@/components/admin/tables/bookBorrow/data-table";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const Page = async () => {
  const { data } = await getBorrowedBooksWithDetails();

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <h2 className="text-xl font-semibold mb-6">All Borrowed Books</h2>
      <BookBorrowTable data={data} />
    </section>
  );
};

export default Page;