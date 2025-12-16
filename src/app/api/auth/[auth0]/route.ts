import { NextRequest, NextResponse } from "next/server";
import { handleAuth } from "@auth0/nextjs-auth0";

// Wrap to unwrap params Promise expected by Next.js 16 app router
export const GET = async (
	req: NextRequest,
	context: { params: Promise<{ auth0: string }> }
) => {
	try {
		// Check if Auth0 is configured
		if (!process.env.AUTH0_SECRET || !process.env.AUTH0_ISSUER_BASE_URL) {
			return NextResponse.json(
				{ error: "Auth0 is not configured. Please use mock authentication or configure Auth0 environment variables." },
				{ status: 503 }
			);
		}

		const { auth0 } = await context.params;
		const handler = handleAuth();
		return handler(req, { params: { auth0 } });
	} catch (error) {
		console.error("Auth error:", error);
		return NextResponse.json(
			{ error: "Authentication service unavailable" },
			{ status: 500 }
		);
	}
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
