"use client";

import { useState } from "react";
import ResumePreview from "../../components/ResumePreview";
import type { ResumeFormData } from "@/components/ResumeForm";
import ResumeForm from "@/components/ResumeForm";

export default function BuilderPage() {
  const [resumeData, setResumeData] = useState<ResumeFormData | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">Resume Builder</h1>
        <ResumeForm onChange={setResumeData} />
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-4">Preview</h1>
        {resumeData ? <ResumePreview data={resumeData} /> : <p>Fill the form to see preview</p>}
      </div>
    </div>
  );
}