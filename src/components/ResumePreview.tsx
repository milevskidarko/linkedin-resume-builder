"use client";

import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type ResumeData = {
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
};

export default function ResumePreview({ data }: { data: ResumeData }) {
  const previewRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    try {
      if (!previewRef.current) {
        console.error("No preview ref");
        return;
      }
      console.log("Starting PDF generation");
      const canvas = await html2canvas(previewRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        logging: false,
        backgroundColor: '#ffffff',
        width: 800,
        height: 600,
      });
      console.log("Canvas created", canvas);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight > 295) {
        // Scale down to fit on one page
        const scale = 295 / imgHeight;
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth * scale, 295);
      } else {
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      }

      pdf.save("resume.pdf");
      console.log("PDF saved");
    } catch (error) {
      console.error("Error generating PDF", error);
    }
  };

  return (
    <div>
      <button
        onClick={downloadPDF}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Download PDF
      </button>
      <div
        ref={previewRef}
        style={{
          backgroundColor: 'white',
          padding: '24px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{data.personal.name}</h1>
        <p style={{ marginBottom: '0.5rem' }}>{data.personal.email} | {data.personal.phone}</p>
        {data.personal.address && <p style={{ marginBottom: '1rem' }}>{data.personal.address}</p>}

        {data.summary && (
          <div style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Summary</h2>
            <p>{data.summary}</p>
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Experience</h2>
          {data.experience.map((exp, index) => (
            <div key={index} style={{ marginBottom: '0.5rem' }}>
              <h3 style={{ fontWeight: '500' }}>{exp.title} at {exp.company}</h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{exp.startDate} - {exp.endDate || "Present"}</p>
              {exp.description && <p>{exp.description}</p>}
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} style={{ marginBottom: '0.5rem' }}>
              <h3 style={{ fontWeight: '500' }}>{edu.degree}</h3>
              <p>{edu.school} - {edu.graduationDate}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Skills</h2>
          <p>{data.skills.join(", ")}</p>
        </div>
      </div>
    </div>
  );
}