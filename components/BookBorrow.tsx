"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { borrowBook } from "@/lib/actions/book";

interface Props {
    userId: string;
    bookId: string;
    borrowingEligibility: {
        isEligible: boolean;
        message: string;
    }
}

const BookBorrow = ({ userId, bookId, borrowingEligibility: { isEligible, message } }: Props) => {
  const router = useRouter();
  const [borrowing, setBorrowing] = useState(false);

  const handleBorrow = async () => {
    if(!isEligible) {
        toast.error(message, {
            style: {
                background: '#dc2626',
                color: 'white',
            },
        });
        return; // Prevent API call if not eligible
    }

    setBorrowing(true);

    try {
        const result = await borrowBook({ userId, bookId });

        if(result.success) {
            toast.success("Book Borrowed Successfully.", {
                style: {
                    background: '#059669',
                    color: 'white',
                },
            });

            router.push("/my-profile")
        } else {
            toast.error(result.error, {
                style: {
                    background: '#dc2626',
                    color: 'white',
                },
            })
        }
    } catch (error) {
        toast.error("An error occurred while borrowing the book.", {
            style: {
                background: '#dc2626',
                color: 'white',
            },
        })
    } finally {
        setBorrowing(false);
    }
  }
  
    return (
    <Button 
      className="book-overview_btn cursor-pointer" 
      onClick={handleBorrow} 
      disabled={borrowing}
    >
      <Image src="/icons/book.svg" alt="book" width={20} height={20} />
      <p className="font-bebas-neue text-xl text-dark-200">
        {borrowing ? "Borrowing..." : "Borrow Book"}
      </p>
    </Button>
  );
};

export default BookBorrow;
