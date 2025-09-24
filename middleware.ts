import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public pages
const publicPages = ["/sign-in", "/sign-up"];
// Define protected pages
const protectedPages = ["/my-profile"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Get the user's session token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If the user is signed in and tries to visit sign-in or sign-up, redirect home
  if (token && publicPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If the user is NOT signed in and tries to visit a protected page, redirect to sign-in
  if (!token && protectedPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Otherwise, allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/my-profile"], // middleware runs only on these routes
};
