import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BookForm from "@/components/admin/forms/BookForm";

const Page = () => {

  return (
    <>
      <Button asChild className="mb-10 w-fit border border-gray-300 bg-white text-xs font-medium text-dark-200 hover:bg-gray-300/10 transition-all duration-300">
        <Link href="/admin/books">Go Back</Link>
      </Button>

      <section className="w-full max-w-2xl">
        <BookForm />
      </section>
    </>
  );
};
export default Page;