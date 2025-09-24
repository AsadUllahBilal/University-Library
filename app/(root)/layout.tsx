import Header from "@/components/Header";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <main
      className="flex min-h-screen flex-1 flex-col px-10 md:px-16 bg-dark-100 bg-cover bg-top text-white"
      style={{ backgroundImage: "url('/images/pattern.webp')" }}
    >
      <div className="mx-auto max-w-7xl">
        <Header session={session} />
        <div className="mt-20 pb-20">{children}</div>
      </div>
    </main>
  );
}
