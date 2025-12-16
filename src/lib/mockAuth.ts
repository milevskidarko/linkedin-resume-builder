import { Session } from "@auth0/nextjs-auth0";
import { useState } from "react";

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
  
  return {
    user,
    isLoading: false,
    login: () => setUser(mockSession.user),
    logout: () => setUser(null),
  };
}
