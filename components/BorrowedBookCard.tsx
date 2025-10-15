import React from 'react'
import { db } from '@/database/drizzle';
import { books, borrowRecords } from '@/database/schema';
import { eq, and } from 'drizzle-orm';
import dayjs from 'dayjs';
import { IoBookOutline } from "react-icons/io5";
import { FaRegCalendarAlt } from "react-icons/fa";
import BookCover from './BookCover';
import ReturnButton from './ReturnBookButton';

interface BorrowedBookCardProps {
    userId: string;
}

const BorrowedBookCard = async ({ userId }: BorrowedBookCardProps) => {
  // Get borrowed books for the user
  const borrowedBooks = await db
    .select()
    .from(borrowRecords)
    .where(and(
      eq(borrowRecords.usersId, userId),
      eq(borrowRecords.status, 'BORROWED')
    ))
    .limit(10);

  if (borrowedBooks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 text-lg">No borrowed books found</p>
      </div>
    );
  }

  // Get book details for each borrowed book
  const bookDetails = await Promise.all(
    borrowedBooks.map(async (borrowedBook) => {
      const book = await db
        .select()
        .from(books)
        .where(eq(books.id, borrowedBook.booksId))
        .limit(1);
      
      return {
        ...borrowedBook,
        book: book[0]
      };
    })
  );
  

  return (
    <div className="flex items-center justify-center flex-wrap gap-8 space-y-4 mt-6">
      {bookDetails.map((item) => {
        const isOverdue = dayjs().isAfter(dayjs(item.dueDate));
        const daysUntilDue = dayjs(item.dueDate).diff(dayjs(), 'day');
        
        return (
          <div key={item.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 w-[280px]">
            <div className="flex flex-col gap-4">
              {/* Book Cover */}
              <div className="flex-shrink-0 flex w-full items-center justify-center py-6 rounded-2xl relative" style={{background: item.book.coverColor}}>
              <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>
                <BookCover coverColor={item.book.coverColor} coverImage={item.book.coverUrl} />
              </div>
              
              {/* Book Details */}
              <div className="flex-1">
                <h3 className="text-lg font-medium text-white mt-2">{item.book.title}</h3>
                <p className="my-1 text-gray-300 line-clamp-1 text-sm italic xs:text-base">{item.book.genre}</p>
                
                {/* Borrow Information */}
                <div className="space-y-2">
                  <span className='flex items-center gap-1 text-gray-300 text-sm mt-7'><IoBookOutline/> Borrowed on {dayjs(item.borrowDate).format('MMM DD, YYYY')}</span>

                  <span className={`flex items-center gap-1 text-sm ${isOverdue ? 'text-red-400 font-semibold' : 'text-gray-300'}`}><FaRegCalendarAlt/> Due Date {dayjs(item.dueDate).format('MMM DD, YYYY')}</span>
                  
                  {isOverdue ? (
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 mt-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-red-400 font-medium">Overdue Return</span>
                      </div>
                      <p className="text-red-300 text-sm mt-1">
                        This book is {Math.abs(daysUntilDue)} days overdue. Please return it immediately.
                      </p>
                    </div>
                  ) : daysUntilDue <= 3 ? (
                    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 mt-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-yellow-400 font-medium">Due Soon</span>
                      </div>
                      <p className="text-yellow-300 text-sm mt-1">
                        This book is due in {daysUntilDue} days.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 mt-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-400 font-medium">On Time</span>
                      </div>
                      <p className="text-green-300 text-sm mt-1">
                        Due in {daysUntilDue} days.
                      </p>
                    </div>
                  )}
                  <ReturnButton borrowId={item.id} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BorrowedBookCard;