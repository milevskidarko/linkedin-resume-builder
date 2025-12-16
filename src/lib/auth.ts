import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function getUserFromSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("appSession");
    
    if (!sessionCookie?.value) {
      return null;
    }

    // For now, we'll extract user info from the cookie
    // Auth0 encrypts the session, so we need to decode it
    // This is a simplified approach - in production you'd want to properly decrypt
    
    // Since Auth0's getSession has issues with Next.js 16, 
    // let's use a different approach: check if logged in via the auth endpoint
    const response = await fetch(`${process.env.AUTH0_BASE_URL}/api/auth/me`, {
      headers: {
        cookie: `appSession=${sessionCookie.value}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error getting user from session:", error);
    return null;
  }
}

export function requireAuth(handler: (req: NextRequest, user: any, ...args: any[]) => Promise<NextResponse>) {
  return async (req: NextRequest, ...args: any[]) => {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("appSession");
    
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract user from cookie - simplified for Next.js 16 compatibility
    // In a real app, you'd decrypt the Auth0 session properly
    try {
      // Make internal request to auth/me endpoint
      const baseUrl = process.env.AUTH0_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/auth/me`, {
        headers: {
          cookie: req.headers.get('cookie') || '',
        },
      });

      if (!response.ok) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const user = await response.json();
      return handler(req, user, ...args);
    } catch (error) {
      console.error("Auth error:", error);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  };
}
