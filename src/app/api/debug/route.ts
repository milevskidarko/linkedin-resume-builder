import { NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  
  if (!session?.user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  return NextResponse.json({
    auth0Sub: session.user.sub,
    email: session.user.email,
    name: session.user.name,
  });
}
