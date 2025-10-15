import BookVideo from "@/components/BookVideo";
import { Button } from "@/components/ui/button";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import authOptions from "@/lib/auth";
import { eq } from "drizzle-orm";
import { ArrowLeft, CalendarDays, Edit } from "lucide-react";
import { getServerSession, Session } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import BookCover from "@/components/BookCover";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session: Session | null = await getServerSession(authOptions);

  console.log(session?.user?.id);

  // Fetch data based on id
  const [bookDetails] = await db
    .select()
    .from(books)
    .where(eq(books.id, id))
    .limit(1);

  if (!bookDetails) redirect("/404");
  return (
    <section className="w-full p-7">
      <Link href="/admin/books">
        <Button className="bg-white hover:bg-gray-50 cursor-pointer shadow transition-all duration-300">
          <ArrowLeft />
          Go Back
        </Button>
      </Link>
      <div className="flex items-center justify-start gap-10 my-8">
        <div
          className="flex-shrink-0 flex w-[266px] items-center justify-center py-6 rounded-2xl relative"
          style={{ background: bookDetails.coverColor }}
        >
          <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>
          <BookCover
            coverColor={bookDetails.coverColor}
            coverImage={bookDetails.coverUrl}
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="flex flex-row items-center gap-2 text-[#64748B]">Created at: <CalendarDays size={15} className="text-[#3A354E]" />
          <span className="text-[#3A354E]">{bookDetails.createdAt?.toLocaleDateString()}</span></p>
          <h1 className="text-[#1E293B] text-4xl font-semibold">{bookDetails.title}</h1>
          <h3 className="text-[#3A354E] text-[17px] font-semibold">{bookDetails.author}</h3>
          <h3 className="text-[#64748B]">{bookDetails.genre}</h3>
          <p className="flex flex-row items-center gap-2 text-[#64748B]">Available Copies:
          <span className="text-[#3A354E]">{bookDetails.availableCopies}</span></p>
          <p className="flex flex-row items-center gap-2 text-[#64748B]">Rating:
          <span className="text-[#3A354E]">{bookDetails.rating}</span></p>
          <Link href={`/admin/books/edit/${bookDetails.id}`}>
          <Button className="w-full bg-[#25388C] hover:bg-[#25388C]/90 cursor-pointer transition-all duration-300 text-white"><Edit/> Edit Book</Button></Link>
        </div>
      </div>
      <div>
        <div>
          <h1 className="text-2xl font-semibold text-[#1E293B] mb-4">Description</h1>
          <div className="space-y-3 text-xl text-[#64748B]">
          <p className="text-xl text-[#64748B]">{bookDetails.description}</p>
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-[#1E293B] my-4">Summary</h1>
          <div className="space-y-3 text-xl text-[#64748B]">
          {bookDetails.summary.split("\n").map((line,i) => (
            <p key={i}>{line}</p>
          ))}
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-[#1E293B] my-4">Video</h1>
          <BookVideo videoUrl={bookDetails.videoUrl} />
        </div>
      </div>
    </section>
  );
};

export default page;
