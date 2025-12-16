import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";

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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const res = new NextResponse();
  const session = await getSession(req, res);
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resume = await prisma.resume.findFirst({
    where: { id, user: { auth0Sub: session.user.sub as string } },
    include: {
      user: { select: { username: true } },
      experiences: { orderBy: { sort: "asc" } },
      educations: { orderBy: { sort: "asc" } },
      skills: { orderBy: { sort: "asc" } },
    },
  });

  if (!resume) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(
    {
      id: resume.id,
      personal: {
        name: resume.name,
        email: resume.email,
        phone: resume.phone,
        address: resume.address ?? undefined,
      },
      summary: resume.summary ?? undefined,
      experience: resume.experiences.map((exp: (typeof resume.experiences)[number]) => ({
        title: exp.title,
        company: exp.company,
        startDate: exp.startDate,
        endDate: exp.endDate ?? undefined,
        description: exp.description ?? undefined,
      })),
      education: resume.educations.map((edu: (typeof resume.educations)[number]) => ({
        degree: edu.degree,
        school: edu.school,
        graduationDate: edu.graduationDate,
      })),
      skills: resume.skills.map((skill: (typeof resume.skills)[number]) => skill.name),
      isPublic: resume.isPublic,
      username: resume.user?.username ?? null,
      updatedAt: resume.updatedAt,
    }
  );
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const res = new NextResponse();
  const session = await getSession(req, res);
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!isValidPayload(body)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { personal, summary, experience, education, skills, isPublic, username } = body;

  const existing = await prisma.resume.findFirst({
    where: { id, user: { auth0Sub: session.user.sub as string } },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (username !== undefined) {
    await prisma.user.update({
      where: { auth0Sub: session.user.sub as string },
      data: { username: username || null },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await prisma.$transaction(async (tx: any) => {
    await tx.experience.deleteMany({ where: { resumeId: id } });
    await tx.education.deleteMany({ where: { resumeId: id } });
    await tx.skill.deleteMany({ where: { resumeId: id } });

    await tx.resume.update({
      where: { id },
      data: {
        name: personal.name,
        email: personal.email,
        phone: personal.phone,
        address: personal.address,
        summary: summary ?? null,
        isPublic: isPublic ?? existing.isPublic,
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
  });

  return NextResponse.json({ ok: true });
}
