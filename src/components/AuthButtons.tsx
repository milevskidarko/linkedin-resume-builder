"use client";

import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useMockAuth } from "@/lib/mockAuth";
import { useState, useEffect } from "react";

export default function AuthButtons() {
  const { user: auth0User, isLoading, error } = useUser();
  const { user: mockUser, login: mockLogin, logout: mockLogout } = useMockAuth();
  
  // Auto-enable mock auth if Auth0 fails or isn't configured
  const [useMock, setUseMock] = useState(false);
  
  useEffect(() => {
    // If Auth0 throws an error or isn't configured, use mock auth
    if (error) {
      setUseMock(true);
    }
  }, [error]);

  const user = useMock ? mockUser : auth0User;

  if (isLoading) {
    return <span className="text-sm">Loading...</span>;
  }

  if (!user) {
    return (
      <button
        onClick={() => {
          if (useMock) {
            mockLogin();
          } else {
            window.location.href = "/api/auth/login";
          }
        }}
        className="bg-white text-blue-600 px-3 py-1 rounded-md text-sm font-semibold hover:bg-blue-50 transition"
      >
        Sign in
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="hidden sm:inline">Hi, {user.name || user.email}</span>
      {useMock ? (
        <>
          <button
            onClick={mockLogout}
            className="bg-white/10 text-white px-3 py-1 rounded-md font-semibold hover:bg-white/20 transition text-xs"
          >
            Log out
          </button>
          <button
            onClick={() => setUseMock(false)}
            className="bg-white/10 text-white px-3 py-1 rounded-md font-semibold hover:bg-white/20 transition text-xs"
          >
            Use Real Auth0
          </button>
        </>
      ) : (
        <Link
          href="/api/auth/logout"
          className="bg-white/10 text-white px-3 py-1 rounded-md font-semibold hover:bg-white/20 transition"
        >
          Log out
        </Link>
      )}
    </div>
  );
}
