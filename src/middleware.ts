import { auth } from "@/auth";

const allowedPaths = ["/login", "/"];

export default auth((req) => {
  const { auth: userAuth, nextUrl } = req;
  const { pathname, origin } = nextUrl;

  if (!userAuth && allowedPaths.includes(pathname)) {
    return;
  }

  if (!userAuth) {
    return Response.redirect(new URL("/login", origin));
  }

  if (userAuth && pathname === "/login") {
    return Response.redirect(new URL("/carpool", origin));
  }
});
