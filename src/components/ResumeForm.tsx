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
  initialData?: ResumeFormData | null;
};

const ResumeForm: React.FC<ResumeFormProps> = ({
  onChange,
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
    console.log(data);
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              {...register('personal.name')}
              className="w-full p-2 border rounded"
            />
            {errors.personal?.name && (
              <p className="text-red-500 text-sm">
                {errors.personal.name.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              {...register('personal.email')}
              type="email"
              className="w-full p-2 border rounded"
            />
            {errors.personal?.email && (
              <p className="text-red-500 text-sm">
                {errors.personal.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              {...register('personal.phone')}
              className="w-full p-2 border rounded"
            />
            {errors.personal?.phone && (
              <p className="text-red-500 text-sm">
                {errors.personal.phone.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Address</label>
            <input
              {...register('personal.address')}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Summary</h2>
        <textarea
          {...register('summary')}
          className="w-full p-2 border rounded"
          rows={4}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Experience</h2>
        {experience.map((_, index) => (
          <div key={index} className="border p-4 mb-4 rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                {...register(`experience.${index}.title`)}
                placeholder="Job Title"
                className="p-2 border rounded"
              />
              <input
                {...register(`experience.${index}.company`)}
                placeholder="Company"
                className="p-2 border rounded"
              />
              <input
                {...register(`experience.${index}.startDate`)}
                type="date"
                className="p-2 border rounded"
              />
              <input
                {...register(`experience.${index}.endDate`)}
                type="date"
                className="p-2 border rounded"
              />
            </div>
            <textarea
              {...register(`experience.${index}.description`)}
              placeholder="Description"
              className="w-full p-2 border rounded mt-2"
              rows={3}
            />
            {experience.length > 1 && (
              <button
                type="button"
                onClick={() => removeExperience(index)}
                className="mt-2 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addExperience}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Experience
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Education</h2>
        {education.map((_, index) => (
          <div key={index} className="border p-4 mb-4 rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                {...register(`education.${index}.degree`)}
                placeholder="Degree"
                className="p-2 border rounded"
              />
              <input
                {...register(`education.${index}.school`)}
                placeholder="School"
                className="p-2 border rounded"
              />
              <input
                {...register(`education.${index}.graduationDate`)}
                type="date"
                className="p-2 border rounded"
              />
            </div>
            {education.length > 1 && (
              <button
                type="button"
                onClick={() => removeEducation(index)}
                className="mt-2 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addEducation}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Education
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Skills</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-100 px-2 py-1 rounded flex items-center"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            id="skillInput"
            placeholder="Add a skill"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = '';
              }
            }}
            className="flex-1 p-2 border rounded"
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
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded"
      >
        Save Resume
      </button>
    </form>
  );
};

export default ResumeForm;
