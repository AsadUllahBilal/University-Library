import BookOverview from '@/components/BookOverview';
import BookVideo from '@/components/BookVideo';
import { db } from '@/database/drizzle';
import { books } from '@/database/schema';
import authOptions from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { getServerSession, Session } from 'next-auth';
import { redirect } from 'next/navigation';
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = params.id;

  // Fetch book details
  const [book] = await db.select().from(books).where(eq(books.id, id)).limit(1);

  if (!book) {
    return {
      title: "Bookwise - Book Not Found",
      description: "The requested book does not exist in our library.",
    };
  }

  return {
    title: `Bookwise - ${book.title}`,
    description: `${book.title} — Explore details, summary, and video overview.`,
    openGraph: {
      title: `Bookwise - ${book.title}`,
      description: book.summary?.slice(0, 160) || "Explore this book on Bookwise.",
      images: book.coverImage ? [book.coverImage] : [],
    },
  };
}

// ✅ Page component
const Page = async ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const session: Session | null = await getServerSession(authOptions);

  // Fetch data based on id
  const [bookDetails] = await db.select().from(books).where(eq(books.id, id)).limit(1);

  if (!bookDetails) redirect("/404");

  return (
    <>
      <BookOverview {...bookDetails} userId={session?.user?.id} />

      <div className='book-details'>
        <div className='flex-[1.5]'>
          <section className='flex flex-col gap-7'>
            <h3 className='mt-5 font-medium text-xl'>Video</h3>
            <BookVideo videoUrl={bookDetails.videoUrl} />
          </section>

          <section className='mt-10 flex flex-col gap-7'>
            <h3 className='mt-5 font-medium text-xl'>Summary</h3>
            <div className='space-y-3 text-xl text-light-100'>
              {bookDetails.summary.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Page;