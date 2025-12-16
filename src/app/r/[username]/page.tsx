"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ResumePreview from "@/components/ResumePreview";

function ResumeSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-3xl">
        <div className="bg-white p-8 rounded-lg shadow">
          <div className="mb-6 border-b pb-4">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PublicResumePage() {
  const { username } = useParams() as { username: string };
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/public/${username}`)
      .then((res) => {
        if (!res.ok) throw new Error("Resume not found");
        return res.json();
      })
      .then((data) => {
        setData(data.resume as Record<string, unknown>);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load resume");
        setLoading(false);
      });
  }, [username]);

  if (loading) {
    return <ResumeSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold">{error}</p>
          <p className="text-gray-600 mt-2">Resume not found or is private.</p>
        </div>
      </div>
    );
  }

  const resumeData = data as any;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto max-w-3xl py-8">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold">{String(data?.name || "Resume")}</h1>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            ← Back to Home
          </Link>
        </div>
        <ResumePreview formData={resumeData} showPrintButton />
      </div>
    </div>
  );
}
