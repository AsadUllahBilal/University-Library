import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import SessionProviderClient from "@/components/SessionProviderWrapper";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";

const ibmPlexSans = localFont({
  src: [
    { path: "/fonts/IBMPlexSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "/fonts/IBMPlexSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "/fonts/IBMPlexSans-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "/fonts/IBMPlexSans-Bold.ttf", weight: "700", style: "normal" },
  ],
});

const bebasNeue = localFont({
  src: [
    { path: "/fonts/BebasNeue-Regular.ttf", weight: "400", style: "normal" },
  ],
  variable: "--bebas-neue",
});

export const metadata: Metadata = {
  title: "Bookwise - Home",
  description: "A library Management System.",
  icons: "/icons/logo.svg",
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <SessionProviderClient session={session}>
        <body
          className={`${ibmPlexSans.className} ${bebasNeue.variable} antialiased`}
        >
          <NextTopLoader
            showSpinner={false}
            color="#e7c9a5"
            height={3}
            easing="ease"
            speed={200}
            initialPosition={0.08}
            crawlSpeed={200}
          />
          {children}
          <Toaster />
        </body>
      </SessionProviderClient>
    </html>
  );
};

export default RootLayout;
