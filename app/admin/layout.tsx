import React, { ReactNode } from "react";
import { redirect } from "next/navigation";
import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";
import "@/styles/admin.css";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth";
import { users } from "@/database/schema";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookwise - Admin",
  description: "A library Management System."
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) redirect("/sign-in");

  // 🔥 Fetch latest role from DB instead of session
  let dbUser: any[] = [];
  try {
    dbUser = await db
      .select({ id: users.id, role: users.role, lastActivityDate: users.lastActivityDate })
      .from(users)
      .where(eq(users.id, session.user.id as string))
      .limit(1);
  } catch (e) {
    redirect("/api/auth/signout?callbackUrl=/sign-in");
  }

  const userRole = dbUser[0]?.role;
  const isAdmin = userRole === "ADMIN";

  if (!isAdmin) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen w-full flex-row">
      <Sidebar session={session} />
      <div className="flex w-[calc(100%-264px)] flex-1 flex-col bg-[#F8F8FF] p-5 md:p-10">
        <Header session={session} />
        {children}
      </div>
    </main>
  );
};

export default Layout;