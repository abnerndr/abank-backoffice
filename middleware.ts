import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAMES } from "./app/lib/api/constants";

const PUBLIC_PATHS = ["/login"];
const ADMIN_PREFIXES = ["/dashboard", "/usuarios", "/transacoes", "/saldo", "/estornos"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

function isAdminPath(pathname: string): boolean {
  return ADMIN_PREFIXES.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

function hasSessionCookies(request: NextRequest): boolean {
  return Boolean(
    request.cookies.get(COOKIE_NAMES.accessToken)?.value ||
      request.cookies.get(COOKIE_NAMES.refreshToken)?.value
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = hasSessionCookies(request);

  if (isPublicPath(pathname)) {
    if (hasSession) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (isAdminPath(pathname) && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
