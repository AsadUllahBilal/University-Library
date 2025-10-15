"use client";

import { Session } from "next-auth";
import { Input } from "../ui/input";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Header = ({ session }: { session: Session }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [q, setQ] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fromUrl = searchParams.get("q") || "";
    setQ(fromUrl);
  }, [searchParams]);

  const pushQuery = (value: string) => {
    const query = value.trim();
    const params = new URLSearchParams(searchParams.toString());
    if (query) params.set("q", query); else params.delete("q");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const onSubmit = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    pushQuery(value);
  };

  return (
    <header className="flex lg:items-end items-start justify-between lg:flex-row flex-col gap-5 sm:mb-10 mb-5">
      <div>
        <h2 className="text-2xl font-semibold text-dark-400">
          Welcome back, {session?.user?.name}
        </h2>
        <p className="text-base text-slate-500">
          Monitor all of your users and books here
        </p>
      </div>

      <Input
        className="admin-search w-[350px]"
        placeholder="Search on this page"
        value={q}
        onChange={(e) => {
          const next = e.target.value;
          setQ(next);
          if (debounceRef.current) clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(() => pushQuery(next), 300);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit(q);
        }}
        onBlur={() => onSubmit(q)}
      />
    </header>
  );
};
export default Header;