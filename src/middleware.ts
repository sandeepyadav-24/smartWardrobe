import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Add a small delay to give time for the session to be established
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  console.log(
    "Middleware running for path:",
    req.nextUrl.pathname,
    "Session:",
    !!session
  );

  // Protect dashboard routes
  if (req.nextUrl.pathname.startsWith("/dashboard") && !session) {
    // Add a query parameter to help debug
    return NextResponse.redirect(
      new URL(`/auth/signin?from=${req.nextUrl.pathname}`, req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
