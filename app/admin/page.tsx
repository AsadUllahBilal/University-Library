import React from "react";
import { db } from "@/database/drizzle";
import { books, users, borrowRecords } from "@/database/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BookCover from "@/components/BookCover";
import { Calendar, Plus } from "lucide-react";
import { getInitials, truncate } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const Page = async () => {
  let recentBooks: any[] = [];
  let borrowRequests: any[] = [];
  let accountRequests: any[] = [];

  try {
    recentBooks = await db
      .select()
      .from(books)
      .orderBy(desc(books.createdAt))
      .limit(8);
  } catch {}

  try {
    borrowRequests = await db
      .select({
        id: borrowRecords.id,
        usersId: borrowRecords.usersId,
        booksId: borrowRecords.booksId,
        status: borrowRecords.status,
        createdAt: borrowRecords.createdAt,
      })
      .from(borrowRecords)
      .orderBy(desc(borrowRecords.createdAt))
      .limit(8);
  } catch {}

  try {
    accountRequests = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        createdAt: users.createdAt,
        status: users.status,
      })
      .from(users)
      .where(eq(users.status, "PENDING"))
      .orderBy(desc(users.createdAt))
      .limit(8);
  } catch {}

  return (
    <section className="w-full space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl bg-white p-6">
            <div className="w-full flex items-center justify-between">
              <h2 className="text-xl font-semibold mb-4">Borrow Requests</h2>
              <Link href="/admin/book-requests">
                <Button className="text-[#25388C] bg-[#F8F8FF] hover:bg-[#F8F8FF]/90 transition-all duration-300 cursor-pointer">
                  View All
                </Button>
              </Link>
            </div>
            {borrowRequests.length === 0 ? (
              <p className="text-slate-500">No borrow activity.</p>
            ) : (
              <ul className="divide-y divide-slate-200">
                {borrowRequests.map((r) => (
                  <li
                    key={r.id}
                    className="py-3 text-sm flex items-center justify-between"
                  >
                    <span>
                      Record: {r.id.slice(0, 8)} • {r.status}
                    </span>
                    <span className="text-slate-500">
                      {new Date(r.createdAt as any).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6">
            <div className="w-full flex items-center justify-between">
              <h2 className="text-xl font-semibold mb-4">Account Requests</h2>
              <Link href="/admin/account-requests">
                <Button className="text-[#25388C] bg-[#F8F8FF] hover:bg-[#F8F8FF]/90 transition-all duration-300 cursor-pointer">
                  View All
                </Button>
              </Link>
            </div>
            {accountRequests.length === 0 ? (
              <p className="text-slate-500">No pending accounts.</p>
            ) : (
              <ul className="divide-y divide-slate-200 flex gap-3">
                {accountRequests.map((u) => (
                  <div
                    key={u.id}
                    className="p-4 w-[160px] bg-[#F8F8FF] rounded-md flex items-center justify-center flex-col gap-1"
                  >
                    <Avatar>
                      <AvatarFallback className="bg-primary">
                        {getInitials(u.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[18px] font-semibold">
                      {u.fullName}
                    </span>
                    <span className="text-[#64748B]">
                      {truncate(u.email, 13)}
                    </span>
                  </div>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6">
          <div className="w-full flex items-center justify-between">
            <h2 className="text-xl font-semibold mb-4">Recently Added Books</h2>
            <Link href="/admin/books">
              <Button className="text-[#25388C] bg-[#F8F8FF] hover:bg-[#F8F8FF]/90 transition-all duration-300 cursor-pointer">
                View All
              </Button>
            </Link>
          </div>
          {recentBooks.length === 0 ? (
            <p className="text-slate-500">No Books is here.</p>
          ) : (
            <div className="flex flex-col gap-5">
              <Link href="/admin/books/new">
                <Button className="h-[75px] bg-[#F8F8FF] hover:bg-[#F8F8FF] flex gap-3 text-[18px] cursor-pointer">
                  <div className="w-[45px] h-[45px] bg-white rounded-full grid place-items-center text-black">
                    <Plus className="text-[24px]" />
                  </div>{" "}
                  Add New Book
                </Button>
              </Link>
              {recentBooks.map((book) => (
                <div className="flex gap-3 items-center" key={book.id}>
                  <BookCover
                    coverColor={book.coverColor}
                    coverImage={book.coverUrl}
                    variant="small"
                  />
                  <div>
                    <h3 className="font-bold">{book.title}</h3>
                    <span className="text-[#64748B]">
                      By {book.author} • {book.genre}
                    </span>
                    <span className="text-[#64748B] text-[16px] flex items-center gap-2">
                      <Calendar size={14} />{" "}
                      {book.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
export default Page;