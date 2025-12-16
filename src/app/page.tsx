"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
    const { data: session, status } = useSession();
  
    if (status === "loading") {
      return <span className="text-sm">Loading...</span>;
    }
    
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to LinkedIn Resume Builder</h1>
      <p className="text-lg mb-8">
        Create a professional resume in minutes. Fill out the form and see your resume update in real-time.
      </p>
      <Link
        href={session ? "/builder" : "#"}
        className={`inline-block px-6 py-3 rounded-lg text-base font-semibold transition shadow-lg cursor-pointer ${
          session 
            ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl" 
            : "bg-gray-400 text-gray-200 cursor-not-allowed pointer-events-none"
        }`}
      >
        Start Building Your Resume
      </Link>
    </div>
  );
}
