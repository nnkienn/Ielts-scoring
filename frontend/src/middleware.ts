import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const rt = req.cookies.get("rt")?.value;
  const { pathname } = req.nextUrl;

  const isAuthPage =
    pathname.startsWith("/signin") || pathname.startsWith("/signup");

  const isProtected =
    pathname.startsWith("/homepage") ;

  if (!rt && isProtected) {
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  if (rt && isAuthPage) {
    const url = req.nextUrl.clone();
    url.pathname = "/homepage";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/signin",
    "/signup",
    "/homepage",
    "/translate",
  ],
};