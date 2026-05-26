import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/editor", "/ats", "/templates", "/preview", "/settings"];

export function middleware(request: NextRequest) {
  const authRequired = process.env.NEXT_PUBLIC_AUTH_MODE === "required";
  const isProtected = protectedRoutes.some((path) => request.nextUrl.pathname.startsWith(path));

  if (!authRequired || !isProtected) {
    return NextResponse.next();
  }

  const hasSession =
    request.cookies.has("authjs.session-token") ||
    request.cookies.has("__Secure-authjs.session-token") ||
    request.cookies.has("next-auth.session-token") ||
    request.cookies.has("__Secure-next-auth.session-token");

  if (!hasSession) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/editor/:path*", "/ats/:path*", "/templates/:path*", "/preview/:path*", "/settings/:path*"]
};
