import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc, sql } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { search = "", page = "1" } = Object.fromEntries(new URL(req.url).searchParams);
    const pageSize = 10;
    const pageNumber = parseInt(page as string, 10);

    const raw = search.trim();
    const hasSearch = raw !== "";
    // Full-text search vector and query for stronger matching
    const searchVector = sql`to_tsvector('simple', coalesce(${books.title}, '') || ' ' || coalesce(${books.author}, '') || ' ' || coalesce(${books.summary}, '') || ' ' || coalesce(${books.genre}, ''))`;
    const tsQuery = sql`plainto_tsquery('simple', ${raw})`;

    // Efficient total count
    const countQuery = db.select({ count: sql<number>`count(*)` }).from(books);
    const [countRow] = hasSearch
      ? await db
          .select({ count: sql<number>`count(*)` })
          .from(books)
          .where(sql`${searchVector} @@ ${tsQuery}`)
      : await countQuery;
    const totalBooksCount = Number(countRow?.count || 0);
    const totalPages = Math.max(1, Math.ceil(totalBooksCount / pageSize));

    // Fetch paginated books with ordering
    const dataQuery = db
      .select({
        id: books.id,
        title: books.title,
        author: books.author,
        genre: books.genre,
        rating: books.rating,
        coverUrl: books.coverUrl,
        coverColor: books.coverColor,
        description: books.description,
        totalCopies: books.totalCopies,
        availableCopies: books.availableCopies,
        videoUrl: books.videoUrl,
        summary: books.summary,
        createdAt: books.createdAt,
        rank: sql<number>`ts_rank(${searchVector}, ${tsQuery})`,
      })
      .from(books)
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize);

    const paginatedBooks = hasSearch
      ? await db
          .select({
            id: books.id,
            title: books.title,
            author: books.author,
            genre: books.genre,
            rating: books.rating,
            coverUrl: books.coverUrl,
            coverColor: books.coverColor,
            description: books.description,
            totalCopies: books.totalCopies,
            availableCopies: books.availableCopies,
            videoUrl: books.videoUrl,
            summary: books.summary,
            createdAt: books.createdAt,
            rank: sql<number>`ts_rank(${searchVector}, ${tsQuery})`,
          })
          .from(books)
          .where(sql`${searchVector} @@ ${tsQuery}`)
          .orderBy(sql`ts_rank(${searchVector}, ${tsQuery}) DESC`, desc(books.createdAt))
          .limit(pageSize)
          .offset((pageNumber - 1) * pageSize)
      : await db
          .select()
          .from(books)
          .orderBy(desc(books.createdAt))
          .limit(pageSize)
          .offset((pageNumber - 1) * pageSize);

    return NextResponse.json(
      { books: paginatedBooks, totalPages, total: totalBooksCount, page: pageNumber, pageSize },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 400 });
  }
}