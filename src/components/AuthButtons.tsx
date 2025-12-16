"use client";

import Link from "next/link";
import { useMockAuth } from "@/lib/mockAuth";

export default function AuthButtons() {
  // Temporarily using only mock auth until Auth0 is configured
  const { user: mockUser, login: mockLogin, logout: mockLogout } = useMockAuth();
  
  const user = mockUser;

  if (!user) {
    return (
      <button
        onClick={mockLogin}
        className="bg-white text-blue-600 px-3 py-1 rounded-md text-sm font-semibold hover:bg-blue-50 transition"
      >
        Sign in
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="hidden sm:inline">Hi, {user.name || user.email}</span>
      <button
        onClick={mockLogout}
        className="bg-white/10 text-white px-3 py-1 rounded-md font-semibold hover:bg-white/20 transition"
      >
        Log out
      </button>
    </div>
  );
}
