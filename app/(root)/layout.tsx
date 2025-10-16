import Header from "@/components/Header";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import authOptions from "@/lib/auth";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { after } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // If no session, redirect to sign-in
  if (!session?.user) {
    redirect("/sign-in");
  }

  // Check if user still exists in DB
  let user: { id: string; lastActivityDate: string | null }[] = [];
  try {
    user = await db
      .select({ id: users.id, lastActivityDate: users.lastActivityDate })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);
  } catch (e) {
    redirect("/api/auth/signout?callbackUrl=/sign-in");
  }

  // If user was deleted, destroy session & redirect
  if (!user.length) {
    redirect("/api/auth/signout?callbackUrl=/sign-in");
  }

  // Update last activity date
  after(async () => {
    if (!session?.user?.id) return;

    const today = new Date().toISOString().slice(0, 10);
    if (user[0].lastActivityDate === today) return;

    await db
      .update(users)
      .set({ lastActivityDate: today })
      .where(eq(users.id, session.user.id));
  });

  return (
    <main
      className="flex min-h-screen flex-1 flex-col px-4 prof-s:px-10 md:px-16 bg-dark-100 bg-cover object-cover bg-top text-white"
      style={{ backgroundImage: "url('/images/pattern.webp')" }}
    >
      <div className="mx-auto max-w-7xl">
        <Header session={session} />
        <div className="mt-20 pb-20">{children}</div>
      </div>
    </main>
  );
}