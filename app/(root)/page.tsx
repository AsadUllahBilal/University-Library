import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import authOptions from "@/lib/auth";
import { desc } from "drizzle-orm";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const Home = async () => {
  const session: Session | null = await getServerSession(authOptions);

  let latestBooks: Book[] = [];
  try {
    latestBooks = (await db
      .select()
      .from(books)
      .orderBy(desc(books.createdAt))
      .limit(10)) as Book[];
  } catch (e) {
    latestBooks = [];
  }
  return (
    <>
      {latestBooks.length > 0 ? (
        <BookOverview
          {...latestBooks[0]}
          userId={session?.user?.id as string}
        />
      ) : (
        <p>No books available yet.</p>
      )}

      <BookList
        title="Latest Books"
        books={latestBooks.slice(1)}
        containerClassName="mt-28"
      />
    </>
  );
};

export default Home;
