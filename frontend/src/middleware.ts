// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_PAGES = ["/signin", "/signup"];
const PROTECTED_PREFIXES = [
  "/homepage",
  "/translate",
  "/grade",
  "/grade-list",
  "/payment",           // 👈 thêm trang thanh toán
  "/payment-history",
  "/setting",
];

// Các trang công khai (Stripe sẽ redirect về đây)
const PUBLIC_EXACT = ["/success", "/cancel"]; // đổi thành '/payment/success'... nếu bạn dùng path khác

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Cho qua các trang public
  if (PUBLIC_EXACT.includes(pathname)) {
    return NextResponse.next();
  }

  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  // rt = refresh token (httpOnly) do backend set
  const hasRT = Boolean(req.cookies.get("rt")?.value);

  // Chưa đăng nhập mà vào trang cần bảo vệ -> chuyển về /signin
  if (!hasRT && isProtected) {
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    url.searchParams.set("next", pathname); // optional: quay lại trang cũ sau khi login
    return NextResponse.redirect(url);
  }

  // Đã đăng nhập mà vào /signin|/signup -> đẩy về /homepage
  if (hasRT && isAuthPage) {
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
    "/grade",
    "/grade-list",
    "/payment",          // 👈 nhớ thêm
    "/payment-history",
    "/setting",
    "/success",          // public
    "/cancel",           // public
  ],
};
