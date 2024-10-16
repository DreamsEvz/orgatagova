import { auth } from "@/auth";
import { NextResponse } from "next/server";

const allowedPaths = ["/login", "/"];

export default auth((req) => {
  const { auth: userAuth, nextUrl } = req;
  const { pathname } = nextUrl;

  if (!userAuth && allowedPaths.includes(pathname)) {
    return NextResponse.next();
  }

  if (!userAuth && pathname === "/profile") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!userAuth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (userAuth && pathname === "/login") {
    return NextResponse.redirect(new URL("/carpool", req.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
