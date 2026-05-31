import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  getLocaleFromAcceptLanguage,
  locales,
} from "./i18n/config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const preferredLocale = getLocaleFromAcceptLanguage(
    request.headers.get("accept-language"),
  );

  request.nextUrl.pathname = `/${preferredLocale}${pathname === "/" ? "" : pathname}`;

  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!api|_next|media|.*\\..*).*)"],
};
