import { Session } from "@auth0/nextjs-auth0";
import { useState, useEffect } from "react";

export const mockSession: Session = {
  user: {
    sub: "auth0|mockuser123",
    email: "demo@example.com",
    name: "Demo User",
    email_verified: true,
  },
};

export function useMockAuth(): { 
  user: typeof mockSession.user | null; 
  isLoading: boolean;
  login: () => void;
  logout: () => void;
} {
  const [user, setUser] = useState<typeof mockSession.user | null>(null);
  
  useEffect(() => {
    // Check localStorage on mount
    const stored = localStorage.getItem('mockAuthUser');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);
  
  const login = () => {
    localStorage.setItem('mockAuthUser', JSON.stringify(mockSession.user));
    setUser(mockSession.user);
    window.location.reload();
  };
  
  const logout = () => {
    localStorage.removeItem('mockAuthUser');
    setUser(null);
    window.location.reload();
  };
  
  return {
    user,
    isLoading: false,
    login,
    logout,
  };
}
