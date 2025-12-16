"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span className="text-sm">Loading...</span>;
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn("google")}
        className="bg-white text-blue-600 px-3 py-1 rounded-md text-sm font-semibold hover:bg-blue-50 transition"
      >
        Sign in
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="hidden sm:inline">Hi, {session.user?.name || session.user?.email}</span>
      <button
        onClick={() => signOut()}
        className="bg-white/10 text-white px-3 py-1 rounded-md font-semibold hover:bg-white/20 transition"
      >
        Log out
      </button>
    </div>
  );
}
