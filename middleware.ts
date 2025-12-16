import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnProtected = req.nextUrl.pathname.startsWith("/builder") || req.nextUrl.pathname.startsWith("/preview");

  if (isOnProtected && !isLoggedIn) {
    return Response.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
