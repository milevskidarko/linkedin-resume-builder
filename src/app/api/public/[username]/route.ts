import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, context: { params: Promise<{ username: string }> }) {
  const { username } = await context.params;

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      resumes: {
        where: { isPublic: true },
        orderBy: { updatedAt: "desc" },
        take: 1,
        include: {
          experiences: { orderBy: { sort: "asc" } },
          educations: { orderBy: { sort: "asc" } },
          skills: { orderBy: { sort: "asc" } },
        },
      },
    },
  });

  if (!user || user.resumes.length === 0) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  const resume = user.resumes[0];

  return NextResponse.json({
    username: user.username,
    resume: {
      id: resume.id,
      name: resume.name,
      email: resume.email,
      phone: resume.phone,
      address: resume.address,
      summary: resume.summary,
      experiences: resume.experiences.map((exp: any) => ({
        title: exp.title,
        company: exp.company,
        startDate: exp.startDate,
        endDate: exp.endDate,
        description: exp.description,
      })),
      educations: resume.educations.map((edu: any) => ({
        degree: edu.degree,
        school: edu.school,
        graduationDate: edu.graduationDate,
      })),
      skills: resume.skills.map((skill: any) => skill.name),
    },
  });
}
