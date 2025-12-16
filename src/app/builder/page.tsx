'use client';

import { useEffect, useRef, useState } from 'react';
import ResumePreview, {
  type ResumeTheme,
} from '../../components/ResumePreview';
import type { ResumeFormData } from '@/components/ResumeForm';
import ResumeForm from '@/components/ResumeForm';

const emptyResume: ResumeFormData = {
  personal: { name: '', email: '', phone: '', address: '' },
  summary: '',
  experience: [
    { title: '', company: '', startDate: '', endDate: '', description: '' },
  ],
  education: [{ degree: '', school: '', graduationDate: '' }],
  skills: [],
};

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface ResumeMetadata {
  id: string;
  isPublic: boolean;
  username: string | null;
}

export default function BuilderPage() {
  const [resumeData, setResumeData] = useState<ResumeFormData>(emptyResume);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ResumeMetadata>({
    id: '',
    isPublic: false,
    username: null,
  });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [theme, setTheme] = useState<ResumeTheme>('classic');
  const saveTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadLatest = async () => {
      try {
        const listRes = await fetch('/api/resumes', { cache: 'no-store' });

        if (!listRes.ok) {
          if (!cancelled) setLoading(false);
          return;
        }

        const listJson = await listRes.json();
        const first = listJson.resumes?.[0];

        if (first?.id) {
          const res = await fetch(`/api/resumes/${first.id}`, {
            cache: 'no-store',
          });
          if (!res.ok) {
            if (!cancelled) setLoading(false);
            return;
          }
          const data = await res.json();
          if (!cancelled) {
            setResumeId(data.id);
            setMetadata({
              id: data.id,
              isPublic: data.isPublic ?? false,
              username: data.username ?? null,
            });
            setUsernameInput(data.username ?? '');
            const loadedData = {
              personal: {
                name: data.personal?.name || '',
                email: data.personal?.email || '',
                phone: data.personal?.phone || '',
                address: data.personal?.address || '',
              },
              summary: data.summary ?? '',
              experience: data.experience ?? emptyResume.experience,
              education: data.education ?? emptyResume.education,
              skills: data.skills ?? [],
            };
            setResumeData(loadedData);
            setLastSaved(new Date(data.updatedAt ?? Date.now()));
          }
        }
      } catch (e) {
        // Failed to load resumes
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadLatest();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void saveDraft(resumeData);
    }, 800);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeData]);

  const saveDraft = async (
    data: ResumeFormData,
    metaData?: { isPublic?: boolean; username?: string }
  ) => {
    try {
      setStatus('saving');
      setError(null);
      const payload = {
        ...data,
        ...(metaData && {
          isPublic: metaData.isPublic,
          username: metaData.username,
        }),
      };

      const resp = await fetch(
        resumeId ? `/api/resumes/${resumeId}` : '/api/resumes',
        {
          method: resumeId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!resp.ok) {
        const text = await resp.text();
        setStatus('error');
        setError(`Save failed (${resp.status}): ${text || 'Unknown error'}`);
        return;
      }

      if (!resumeId) {
        const json = await resp.json();
        setResumeId(json.id);
        setMetadata({
          id: json.id,
          isPublic: json.isPublic ?? false,
          username: json.username ?? null,
        });
      } else if (metaData) {
        setMetadata((prev) => ({ ...prev, ...metaData }));
      }

      setStatus('saved');
      setLastSaved(new Date());
    } catch (e) {
      setStatus('error');
      setError(e instanceof Error ? e.message : 'Save failed');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">Resume Builder</h1>
        {loading ? (
          <p>Loading your latest draft...</p>
        ) : (
          <>
            <ResumeForm
              key={resumeId || 'new'}
              initialData={resumeData}
              onChange={setResumeData}
              onSave={() => saveDraft(resumeData)}
            />

            {resumeId && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6 mt-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Sharing Settings
                </h3>
                <p className="text-xs text-gray-500 mb-5">
                  Control who can view your resume
                </p>

                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={metadata.isPublic}
                        onChange={(e) => {
                          const newIsPublic = e.target.checked;
                          setMetadata((prev) => ({
                            ...prev,
                            isPublic: newIsPublic,
                          }));
                          void saveDraft(resumeData, {
                            isPublic: newIsPublic,
                            username: usernameInput,
                          });
                        }}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Make resume public
                      </span>
                      <p className="text-xs text-gray-500">
                        Anyone with the link can view your resume
                      </p>
                    </div>
                  </label>

                  {metadata.isPublic && (
                    <div className="pl-8 pt-2 space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2">
                          Username for public link
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={usernameInput}
                            onChange={(e) => setUsernameInput(e.target.value)}
                            placeholder="your-username"
                            className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                          />
                          <button
                            onClick={() =>
                              void saveDraft(resumeData, {
                                isPublic: true,
                                username: usernameInput,
                              })
                            }
                            disabled={status === 'saving'}
                            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            {status === 'saving' ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      </div>
                      {metadata.username && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-xs font-medium text-blue-900 mb-1">
                            Public Link
                          </p>
                          <code className="text-sm text-blue-700 font-mono">
                            /r/{metadata.username}
                          </code>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
        <div className="mt-3 text-sm text-gray-600">
          {status === 'saving' && <span>Saving...</span>}
          {status === 'saved' && lastSaved && (
            <span>Saved at {lastSaved.toLocaleTimeString()}</span>
          )}
          {status === 'error' && <span className="text-red-600">{error}</span>}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Preview</h1>
          <div className="flex items-center gap-2">
            <label
              htmlFor="theme-select"
              className="text-sm font-medium text-gray-700"
            >
              Theme:
            </label>
            <select
              id="theme-select"
              value={theme}
              onChange={(e) => setTheme(e.target.value as ResumeTheme)}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="classic">Classic Blue</option>
              <option value="modern">Modern Teal</option>
              <option value="professional">Professional Navy</option>
              <option value="minimal">Minimal Black</option>
            </select>
          </div>
        </div>
        {resumeData ? (
          <ResumePreview formData={resumeData} showPrintButton theme={theme} />
        ) : (
          <p>Fill the form to see preview</p>
        )}
      </div>
    </div>
  );
}
