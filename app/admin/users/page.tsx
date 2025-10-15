import React from "react";
import { AllUsersTable } from "@/components/admin/tables/allUsers/data-table";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { desc, like, or } from "drizzle-orm";

const page = async ({ searchParams }: { searchParams: Promise<{ q?: string }> }) => {
  const params = await searchParams;
  const q = (params?.q || "").trim();
  const rows = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      universityId: users.universityId,
      universityCard: users.universityCard,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(
      q
        ? or(like(users.fullName, `%${q}%`), like(users.email, `%${q}%`))
        : undefined as any
    )
    .orderBy(desc(users.createdAt))
    .limit(100);

  const data = rows.map((u) => ({
    id: u.id,
    name: u.fullName,
    email: u.email,
    dateJoined: new Date(u.createdAt as unknown as string).toISOString(),
    universityId: u.universityId,
    universityCard: u.universityCard,
    role: u.role,
    booksBorrowed: 0,
  }));
  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">All Users</h2>
        <AllUsersTable data={data} />
      </div>
    </section>
  );
};

export default page;
