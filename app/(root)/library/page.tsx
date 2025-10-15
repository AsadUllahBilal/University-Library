import React from "react";
import { books } from "@/database/schema";
import { db } from "@/database/drizzle";
import { desc } from "drizzle-orm";
import LibraryPage from "@/components/LibraryPage";
import type { Metadata } from "next";


export async function generateMetadata(): Promise<Metadata> {

  return {
    title: "Bookwise - Library",
    description: "Bookwise Library Page.",
  };
}

const page = async () => {
  const latestBooks = (await db
    .select()
    .from(books)
    .orderBy(desc(books.createdAt))
    .limit(10)) as Book[];
    
  return (
    <>
      <LibraryPage bookData={latestBooks} /> 
    </>
  );
};

export default page;
