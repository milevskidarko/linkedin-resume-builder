'use client';

import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

export type ResumeTheme = 'classic' | 'modern' | 'professional' | 'minimal';

const themes = {
  classic: {
    primary: '#1e40af',
    secondary: '#64748b',
    text: '#1f2937',
    accent: '#2563eb',
    border: '#2563eb',
    lightGray: '#e5e7eb',
  },
  modern: {
    primary: '#0d9488',
    secondary: '#64748b',
    text: '#0f172a',
    accent: '#14b8a6',
    border: '#14b8a6',
    lightGray: '#e5e7eb',
  },
  professional: {
    primary: '#1e3a8a',
    secondary: '#64748b',
    text: '#1f2937',
    accent: '#1e40af',
    border: '#1e3a8a',
    lightGray: '#e5e7eb',
  },
  minimal: {
    primary: '#000000',
    secondary: '#64748b',
    text: '#111827',
    accent: '#374151',
    border: '#000000',
    lightGray: '#e5e7eb',
  },
};

export default function ResumePreview({
  formData,
  showPrintButton,
  theme = 'classic',
}: {
  formData: ResumeData;
  showPrintButton?: boolean;
  theme?: ResumeTheme;
}) {
  const previewRef = useRef<HTMLDivElement>(null);
  const colors = themes[theme];

  const downloadPDF = async () => {
    try {
      if (!previewRef.current) {
        return;
      }
      const canvas = await html2canvas(previewRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        logging: false,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('resume.pdf');
    } catch (error) {
      // PDF generation failed
    }
  };

  return (
    <div>
      {showPrintButton && (
        <button
          onClick={downloadPDF}
          className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Download PDF
        </button>
      )}
      <div
        ref={previewRef}
        style={{
          backgroundColor: 'white',
          padding: '48px',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          maxWidth: '850px',
          margin: '0 auto',
        }}
      >
        {/* Hero Header */}
        <div
          style={{
            marginBottom: '32px',
            borderLeft: `4px solid ${colors.border}`,
            paddingLeft: '16px',
          }}
        >
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: '600',
              marginBottom: '8px',
              color: colors.primary,
              letterSpacing: '-0.025em',
              lineHeight: '1.2',
            }}
          >
            {formData.personal.name}
          </h1>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              color: colors.secondary,
              fontSize: '0.95rem',
              marginTop: '12px',
            }}
          >
            {formData.personal.email && (
              <span
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                ✉ {formData.personal.email}
              </span>
            )}
            {formData.personal.phone && (
              <span
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                📞 {formData.personal.phone}
              </span>
            )}
            {formData.personal.address && (
              <span
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                📍 {formData.personal.address}
              </span>
            )}
          </div>
        </div>

        {/* Summary */}
        {formData.summary && (
          <div style={{ marginBottom: '32px' }}>
            <h2
              style={{
                fontSize: '0.875rem',
                fontWeight: '700',
                color: colors.text,
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              SUMMARY
            </h2>
            <p
              style={{
                color: colors.text,
                lineHeight: '1.7',
                fontSize: '0.95rem',
              }}
            >
              {formData.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        <div style={{ marginBottom: '32px' }}>
          <h2
            style={{
              fontSize: '0.875rem',
              fontWeight: '700',
              color: colors.text,
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            EXPERIENCE
          </h2>
          {formData.experience.map((exp, index) => (
            <div key={index} style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '4px' }}>
                <span
                  style={{
                    fontWeight: '600',
                    fontSize: '1.05rem',
                    color: colors.text,
                  }}
                >
                  {exp.title}
                </span>
                {exp.company && (
                  <span
                    style={{
                      fontWeight: '600',
                      fontSize: '1.05rem',
                      color: colors.text,
                    }}
                  >
                    {' — '}
                    {exp.company}
                  </span>
                )}
              </div>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: colors.secondary,
                  marginBottom: '8px',
                }}
              >
                {exp.startDate} – {exp.endDate || 'Present'}
              </p>
              {exp.description && (
                <p
                  style={{
                    color: colors.text,
                    lineHeight: '1.6',
                    fontSize: '0.9rem',
                    paddingLeft: '16px',
                  }}
                >
                  • {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Education */}
        <div style={{ marginBottom: '32px' }}>
          <h2
            style={{
              fontSize: '0.875rem',
              fontWeight: '700',
              color: colors.text,
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            EDUCATION
          </h2>
          {formData.education.map((edu, index) => (
            <div key={index} style={{ marginBottom: '12px' }}>
              <h3
                style={{
                  fontWeight: '600',
                  fontSize: '1rem',
                  color: colors.text,
                  marginBottom: '2px',
                }}
              >
                {edu.degree}
              </h3>
              <p
                style={{
                  color: colors.secondary,
                  fontSize: '0.9rem',
                }}
              >
                {edu.school} — {edu.graduationDate}
              </p>
            </div>
          ))}
        </div>

        {/* Skills */}
        {formData.skills.length > 0 && (
          <div>
            <h2
              style={{
                fontSize: '0.875rem',
                fontWeight: '700',
                color: colors.text,
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              SKILLS
            </h2>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: colors.lightGray,
                    color: colors.text,
                    padding: '6px 14px',
                    borderRadius: '16px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    border: `1px solid ${colors.lightGray}`,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
