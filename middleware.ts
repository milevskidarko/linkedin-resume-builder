import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware to handle authentication
export function middleware(request: NextRequest) {
  // For now, allow all requests to pass through
  // TODO: Re-enable Auth0 middleware when environment variables are configured
  // import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";
  return NextResponse.next();
}

export const config = {
  matcher: ["/builder/:path*", "/preview/:path*"],
};
