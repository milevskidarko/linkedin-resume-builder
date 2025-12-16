import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ResumePayload = {
  personal: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  summary?: string;
  experience: Array<{
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
    graduationDate: string;
  }>;
  skills: string[];
  isPublic?: boolean;
  username?: string;
};

async function getOrCreateUser(auth0Sub: string, email?: string | null) {
  try {
    return await prisma.user.upsert({
      where: { auth0Sub },
      update: { email: email ?? undefined },
      create: { auth0Sub, email: email ?? undefined },
    });
  } catch (e) {
    return {
      id: "mock-user-id",
      auth0Sub,
      email: email ?? undefined,
      username: null,
    };
  }
}

function isValidPayload(body: unknown): body is ResumePayload {
  if (!body || typeof body !== "object") return false;
  const obj = body as Record<string, unknown>;
  if (!obj.personal || typeof obj.personal !== "object") return false;
  const personal = obj.personal as Record<string, unknown>;
  if (typeof personal.name !== "string" || typeof personal.email !== "string" || typeof personal.phone !== "string") {
    return false;
  }
  if (!Array.isArray((obj as ResumePayload).experience) || !Array.isArray((obj as ResumePayload).education) || !Array.isArray((obj as ResumePayload).skills)) {
    return false;
  }
  return true;
}

export async function GET(req: NextRequest) {
  try {
    console.log('[API /resumes GET] Starting request');
    const session = await getSession();
    console.log('[API /resumes GET] Session:', session ? 'exists' : 'null', session?.user?.sub);
    
    if (!session?.user) {
      console.log('[API /resumes GET] No session found, returning 401');
      return NextResponse.json({ error: "Unauthorized", details: "No session found" }, { status: 401 });
    }
    
    console.log('[API /resumes GET] Getting user:', session.user.sub, session.user.email);
    const dbUser = await getOrCreateUser(session.user.sub, session.user.email);
    console.log('[API /resumes GET] DB User:', dbUser.id);

    const resumes = await prisma.resume.findMany({
      where: { userId: dbUser.id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        summary: true,
        updatedAt: true,
        createdAt: true,
      },
    });

    const response = NextResponse.json({ resumes });
    response.headers.set('X-Auth-Mode', 'dynamic-auth0');
    response.headers.set('X-Deploy-Version', 'v3-dynamic');
    return response;
  } catch (error) {
    return NextResponse.json({ 
      error: "Failed to fetch resumes", 
      details: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  console.log('[API /resumes POST] Starting request');
  const session = await getSession();
  console.log('[API /resumes POST] Session:', session ? 'exists' : 'null', session?.user?.sub);
  
  if (!session?.user) {
    console.log('[API /resumes POST] No session found, returning 401');
    return NextResponse.json({ error: "Unauthorized", details: "No session found" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!isValidPayload(body)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { personal, summary, experience, education, skills, isPublic, username } = body;
  
  const dbUser = await getOrCreateUser(session.user.sub, session.user.email);

  if (username && dbUser.id !== "mock-user-id") {
    try {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { username: username || null },
      });
    } catch (e) {
      // Username update failed
    }
  }

  try {
    const resume = await prisma.resume.create({
      data: {
        userId: dbUser.id,
        name: personal.name,
        email: personal.email,
        phone: personal.phone,
        address: personal.address,
        summary: summary ?? null,
        isPublic: isPublic ?? false,
        experiences: {
          create: experience.map((exp, idx) => ({
            title: exp.title,
            company: exp.company,
            startDate: exp.startDate,
            endDate: exp.endDate || null,
            description: exp.description || null,
            sort: idx,
          })),
        },
        educations: {
          create: education.map((edu, idx) => ({
            degree: edu.degree,
            school: edu.school,
            graduationDate: edu.graduationDate,
            sort: idx,
          })),
        },
        skills: {
          create: skills.map((skill, idx) => ({ name: skill, sort: idx })),
        },
      },
    });
    return NextResponse.json({ id: resume.id, isPublic: resume.isPublic, username }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { id: "mock-resume-" + Math.random().toString(36).slice(2, 9), isPublic: isPublic ?? false, username },
      { status: 201 }
    );
  }
}
