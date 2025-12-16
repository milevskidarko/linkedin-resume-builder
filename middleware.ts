import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";

// Protect resume builder and preview routes
export default withMiddlewareAuthRequired();

export const config = {
  matcher: ["/builder/:path*", "/preview/:path*"],
};
