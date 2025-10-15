"use client";

import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import { returnBook } from "@/lib/actions/book";
import { Button } from "@/components/ui/button";

interface ReturnButtonProps {
  borrowId: string;
}

const ReturnButton: React.FC<ReturnButtonProps> = ({ borrowId }) => {
  const [isPending, startTransition] = useTransition();
  const [isReturned, setIsReturned] = useState(false);

  const handleReturn = () => {
    startTransition(async () => {
      const res = await returnBook(borrowId);

      if (res?.success) {
        toast.success("Book returned successfully!");
        setIsReturned(true);
      } else {
        toast.error(res?.error || "Failed to return the book");
      }
    });
  };

  if (isReturned)
    return (
      <Button
        disabled
        className="bg-green-600 hover:bg-green-600 text-white w-full mt-4"
      >
        Returned
      </Button>
    );

  return (
    <Button
      onClick={handleReturn}
      disabled={isPending}
      className="w-full cursor-pointer mt-4"
    >
      {isPending ? "Returning..." : "Return Book"}
    </Button>
  );
};

export default ReturnButton;
