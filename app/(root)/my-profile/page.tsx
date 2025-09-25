"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import BookList from "@/components/BookList";
import { sampleBooks } from "@/constants";
import { redirect } from "next/navigation";

const Page = () => {
  const {data: session} = useSession();

  if(!session?.user) {
    redirect("/sign-in")
  }
  return (
    <>
        <Button onClick={() => signOut()}>Logout</Button>

      <BookList title="Borrowed Books" books={sampleBooks} />
    </>
  );
};
export default Page;