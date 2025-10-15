'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { Button } from './ui/button';
import BookList from './BookList';
import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from './ui/pagination';
import { useDebounce } from 'use-debounce';

interface Props {
  bookData: Book[];
}

const LibraryPage = ({ bookData }: Props) => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<Book[]>(bookData || []);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedQuery] = useDebounce(query, 300); // waits 300ms after typing
  const normalize = (str: string) => str.toLowerCase().trim();
  const tokens = useMemo(() => normalize(debouncedQuery).split(/\s+/).filter(Boolean), [debouncedQuery]);
  
  const controllerRef = useRef<AbortController | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize from URL
  useEffect(() => {
    const qParam = searchParams.get('q') || '';
    const pParam = parseInt(searchParams.get('page') || '1', 10) || 1;
    setQuery(qParam);
    setPage(pParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync URL when query/page change (debounced for q)
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedQuery.trim()) params.set('q', debouncedQuery.trim()); else params.delete('q');
    params.set('page', String(page));
    const url = `${pathname}?${params.toString()}`;
    router.replace(url, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, page]);

  // Fetch books from API with search & pagination
  useEffect(() => {
    const run = async () => {
      setLoading(true);

      // Abort any in-flight request
      if (controllerRef.current) controllerRef.current.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        const params = new URLSearchParams();
        if (debouncedQuery.trim()) params.set('search', debouncedQuery.trim());
        params.set('page', String(page));
        const res = await fetch(`/api/books?${params.toString()}`, {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('Failed to fetch books');
        const data = await res.json();
        setBooks(data.books || []);
        setTotalPages(data.totalPages || 1);
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          setBooks([]);
          setTotalPages(1);
        }
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [debouncedQuery, page]);

  return (
    <section className="w-full p-4 flex flex-col items-center gap-4">
      <p className="text-[#D6E0FF] uppercase text-[20px] font-medium">
        Discover Your Next Great Read:
      </p>
      <h1 className="text-5xl font-bold text-center text-white capitalize w-[600px]">
        Explore and Search for Any Book In Our Library
      </h1>

      <div className="relative w-[600px] flex h-10 gap-2">
        <Input
          placeholder="Search Any Book"
          className="border-none outline-none w-full h-full bg-[#232839] text-white focus:outline-none px-3"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1); // reset to first page on search
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setPage(1);
          }}
        />
        <Button className="flex items-center justify-center" onClick={() => setPage(1)}>
          {loading ? (
            <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search />
          )}
        </Button>
      </div>

      {loading && books.length === 0 ? (
        <div className="flex justify-center mt-10">
          <span className="h-10 w-10 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
        </div>
      ) : (
        <BookList title="All Books" books={
          books.length > 0 || !debouncedQuery
            ? books
            : bookData.filter((b) => {
                const title = normalize(b.title);
                const author = normalize(b.author);
                const raw = normalize(debouncedQuery);
                if (!raw) return true;
                // match full phrase OR any token locally as fallback
                const full = title.includes(raw) || author.includes(raw);
                const anyToken = tokens.some((t) => title.includes(t) || author.includes(t));
                return full || anyToken;
              })
        } containerClassName="mt-8" />
      )}

      {books.length > 0 && totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <PaginationRoot>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} />
              </PaginationItem>
              {Array.from({ length: totalPages }).slice(0, 5).map((_, idx) => {
                const p = idx + 1;
                return (
                  <PaginationItem key={p}>
                    <PaginationLink isActive={p === page} onClick={() => setPage(p)}>
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext onClick={() => setPage((p) => Math.min(totalPages, p + 1))} />
              </PaginationItem>
            </PaginationContent>
          </PaginationRoot>
        </div>
      )}

      {books.length === 0 && !loading && bookData.filter((b) => {
        const title = normalize(b.title);
        const author = normalize(b.author);
        const raw = normalize(debouncedQuery);
        if (!raw) return false;
        const full = title.includes(raw) || author.includes(raw);
        const anyToken = tokens.some((t) => title.includes(t) || author.includes(t));
        return full || anyToken;
      }).length === 0 && (
        <p className="text-white mt-10">No books found.</p>
      )}
    </section>
  );
};

export default LibraryPage;