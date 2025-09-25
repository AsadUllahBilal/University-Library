"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import BookList from "@/components/BookList";
import { sampleBooks } from "@/constants";

const Page = () => {
  return (
    <>
        <Button onClick={() => signOut()}>Logout</Button>

      <BookList title="Borrowed Books" books={sampleBooks} />
    </>
  );
};
export default Page;