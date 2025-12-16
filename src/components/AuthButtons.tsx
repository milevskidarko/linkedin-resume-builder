"use client";

import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function AuthButtons() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <span className="text-sm">Loading...</span>;
  }

  if (!user) {
    return (
      <Link
        href="/api/auth/login"
        className="bg-white text-blue-600 px-3 py-1 rounded-md text-sm font-semibold hover:bg-blue-50 transition"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="hidden sm:inline">Hi, {user.name || user.email}</span>
      <Link
        href="/api/auth/logout"
        className="bg-white/10 text-white px-3 py-1 rounded-md font-semibold hover:bg-white/20 transition"
      >
        Log out
      </Link>
    </div>
  );
}
