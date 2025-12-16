'use client';

import { useEffect,  useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const resumeSchema = z.object({
  personal: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().min(1, 'Phone is required'),
    address: z.string().optional(),
  }),
  summary: z.string().optional(),
  experience: z.array(
    z.object({
      title: z.string().min(1, 'Title is required'),
      company: z.string().min(1, 'Company is required'),
      startDate: z.string().min(1, 'Start date is required'),
      endDate: z.string().optional(),
      description: z.string().optional(),
    })
  ),
  education: z.array(
    z.object({
      degree: z.string().min(1, 'Degree is required'),
      school: z.string().min(1, 'School is required'),
      graduationDate: z.string().min(1, 'Graduation date is required'),
    })
  ),
  skills: z.array(z.string()),
});

export type ResumeFormData = z.infer<typeof resumeSchema>;

type ResumeFormProps = {
  onChange: (data: ResumeFormData) => void;
  onSave?: () => void;
  initialData?: ResumeFormData | null;
};

const ResumeForm: React.FC<ResumeFormProps> = ({
  onChange,
  onSave,
  initialData,
}: ResumeFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ResumeFormData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: initialData ?? {
      personal: { name: '', email: '', phone: '', address: '' },
      summary: '',
      experience: [
        { title: '', company: '', startDate: '', endDate: '', description: '' },
      ],
      education: [{ degree: '', school: '', graduationDate: '' }],
      skills: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let debounceTimer: NodeJS.Timeout;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subscription = watch((value: any) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      
      debounceTimer = setTimeout(() => {
        onChangeRef.current(value as ResumeFormData);
      }, 500);
    });

    return () => {
      subscription.unsubscribe();
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [watch]);

  const experience = watch('experience');
  const education = watch('education');
  const skills = watch('skills');

  const onSubmit = (data: ResumeFormData) => {
    onChange(data);
  };

  const addExperience = () => {
    setValue('experience', [
      ...experience,
      { title: '', company: '', startDate: '', endDate: '', description: '' },
    ]);
  };

  const removeExperience = (index: number) => {
    setValue(
      'experience',
      experience.filter((_, i) => i !== index)
    );
  };

  const addEducation = () => {
    setValue('education', [
      ...education,
      { degree: '', school: '', graduationDate: '' },
    ]);
  };

  const removeEducation = (index: number) => {
    setValue(
      'education',
      education.filter((_, i) => i !== index)
    );
  };

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setValue('skills', [...skills, trimmedSkill]);
    }
  };

  const removeSkill = (index: number) => {
    setValue(
      'skills',
      skills.filter((_, i) => i !== index)
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Personal Information Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Full Name</label>
            <input
              {...register('personal.name')}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              placeholder="John Doe"
            />
            {errors.personal?.name && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.personal.name.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Email Address</label>
            <input
              {...register('personal.email')}
              type="email"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              placeholder="john@example.com"
            />
            {errors.personal?.email && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.personal.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Phone Number</label>
            <input
              {...register('personal.phone')}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              placeholder="+1 (555) 123-4567"
            />
            {errors.personal?.phone && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.personal.phone.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Address</label>
            <input
              {...register('personal.address')}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              placeholder="City, Country"
            />
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Professional Summary</h2>
        <p className="text-xs text-gray-500 mb-4">Brief overview of your professional background and goals</p>
        <textarea
          {...register('summary')}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
          rows={4}
          placeholder="Passionate software developer with 5+ years of experience..."
        />
      </div>

      {/* Experience Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Work Experience</h2>
            <p className="text-xs text-gray-500 mt-1">Add your professional work history</p>
          </div>
          <button
            type="button"
            onClick={addExperience}
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <span>+</span> Add Experience
          </button>
        </div>
        <div className="space-y-4">
          {experience.map((_, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-5 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Job Title</label>
                  <input
                    {...register(`experience.${index}.title`)}
                    placeholder="Software Engineer"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Company</label>
                  <input
                    {...register(`experience.${index}.company`)}
                    placeholder="Tech Corp"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Start Date</label>
                  <input
                    {...register(`experience.${index}.startDate`)}
                    type="date"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">End Date</label>
                  <input
                    {...register(`experience.${index}.endDate`)}
                    type="date"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-500 mb-2">Description</label>
                <textarea
                  {...register(`experience.${index}.description`)}
                  placeholder="Describe your responsibilities and achievements..."
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                  rows={3}
                />
              </div>
              {experience.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Remove Experience
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Education Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Education</h2>
            <p className="text-xs text-gray-500 mt-1">Add your educational background</p>
          </div>
          <button
            type="button"
            onClick={addEducation}
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <span>+</span> Add Education
          </button>
        </div>
        <div className="space-y-4">
          {education.map((_, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-5 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Degree</label>
                  <input
                    {...register(`education.${index}.degree`)}
                    placeholder="Bachelor of Science in Computer Science"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">School</label>
                  <input
                    {...register(`education.${index}.school`)}
                    placeholder="University Name"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-2">Graduation Date</label>
                  <input
                    {...register(`education.${index}.graduationDate`)}
                    type="date"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>
              {education.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Remove Education
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Skills</h2>
        <p className="text-xs text-gray-500 mb-5">Add your technical and soft skills</p>
        
        {/* Technical Skills */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-700 mb-2">Quick Add: Technical Skills</label>
          <select
            onChange={(e) => {
              if (e.target.value) {
                addSkill(e.target.value);
                e.target.value = '';
              }
            }}
            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
            defaultValue=""
          >
            <option value="">Select a technical skill...</option>
            <optgroup label="Languages">
              <option value="JavaScript">JavaScript</option>
              <option value="TypeScript">TypeScript</option>
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="C#">C#</option>
              <option value="C++">C++</option>
              <option value="PHP">PHP</option>
              <option value="Ruby">Ruby</option>
              <option value="Go">Go</option>
              <option value="Rust">Rust</option>
              <option value="Swift">Swift</option>
              <option value="Kotlin">Kotlin</option>
              <option value="SQL">SQL</option>
            </optgroup>
            <optgroup label="Frameworks & Libraries">
              <option value="React">React</option>
              <option value="Next.js">Next.js</option>
              <option value="Vue.js">Vue.js</option>
              <option value="Angular">Angular</option>
              <option value="Node.js">Node.js</option>
              <option value="Express">Express</option>
              <option value="Django">Django</option>
              <option value="Flask">Flask</option>
              <option value="Spring Boot">Spring Boot</option>
            </optgroup>
            <optgroup label="Tools & Technologies">
              <option value="Git">Git</option>
              <option value="Docker">Docker</option>
              <option value="AWS">AWS</option>
              <option value="Azure">Azure</option>
              <option value="GraphQL">GraphQL</option>
              <option value="REST API">REST API</option>
              <option value="PostgreSQL">PostgreSQL</option>
              <option value="MongoDB">MongoDB</option>
            </optgroup>
          </select>
        </div>

        {/* Soft Skills */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-700 mb-2">Quick Add: Soft Skills</label>
          <select
            onChange={(e) => {
              if (e.target.value) {
                addSkill(e.target.value);
                e.target.value = '';
              }
            }}
            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
            defaultValue=""
          >
            <option value="">Select a soft skill...</option>
            <option value="Leadership">Leadership</option>
            <option value="Communication">Communication</option>
            <option value="Problem Solving">Problem Solving</option>
            <option value="Team Collaboration">Team Collaboration</option>
            <option value="Time Management">Time Management</option>
            <option value="Critical Thinking">Critical Thinking</option>
            <option value="Adaptability">Adaptability</option>
            <option value="Project Management">Project Management</option>
          </select>
        </div>

        {/* All Skills Display */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100 min-h-[80px]">
          {skills.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No skills added yet</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="text-blue-600 hover:text-blue-800 font-bold text-base leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Custom Skill Input */}
        <div className="flex gap-2">
          <input
            type="text"
            id="skillInput"
            placeholder="Add custom skill..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = '';
              }
            }}
            className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
          />
          <button
            type="button"
            onClick={() => {
              const input = document.getElementById(
                'skillInput'
              ) as HTMLInputElement;
              addSkill(input.value);
              input.value = '';
            }}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => onSave?.()}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all"
        >
          Save Resume
        </button>
      </div>
    </form>
  );
};

export default ResumeForm;
