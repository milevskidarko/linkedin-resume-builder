import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";

export async function getUserFromSession() {
  try {
    const session = await getSession();
    return session?.user || null;
  } catch (error) {
    console.error("Error getting user from session:", error);
    return null;
  }
}

export function requireAuth(handler: (req: NextRequest, user: any, ...args: any[]) => Promise<NextResponse>) {
  return async (req: NextRequest, ...args: any[]) => {
    try {
      const session = await getSession();
      
      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      return handler(req, session.user, ...args);
    } catch (error) {
      console.error("Auth error:", error);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  };
}
