import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (!path.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // Check GitHub session (NextAuth JWT)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Check wallet cookie (set client-side after wagmi connects)
  const walletConnected = req.cookies.get("wallet_connected")?.value === "true";
  if (!walletConnected) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
