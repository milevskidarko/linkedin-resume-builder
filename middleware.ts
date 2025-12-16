import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";

// Middleware to handle authentication
export default withMiddlewareAuthRequired({
  returnTo: "/api/auth/login"
});

export const config = {
  matcher: ["/builder/:path*", "/preview/:path*"],
};
