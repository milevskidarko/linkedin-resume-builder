import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to LinkedIn Resume Builder</h1>
      <p className="text-lg mb-8">
        Create a professional resume in minutes. Fill out the form and see your resume update in real-time.
      </p>
      <Link
        href="/builder"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Start Building Your Resume
      </Link>
    </div>
  );
}
