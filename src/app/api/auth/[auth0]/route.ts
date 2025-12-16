import { NextRequest } from "next/server";
import { handleAuth } from "@auth0/nextjs-auth0";

// Wrap to unwrap params Promise expected by Next.js 16 app router
export const GET = async (
	req: NextRequest,
	context: { params: Promise<{ auth0: string }> }
) => {
	const { auth0 } = await context.params;
	const handler = handleAuth();
	return handler(req, { params: { auth0 } });
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
