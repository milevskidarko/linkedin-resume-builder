import { Session } from "@auth0/nextjs-auth0";

export const mockSession: Session = {
  user: {
    sub: "auth0|mockuser123",
    email: "demo@example.com",
    name: "Demo User",
    email_verified: true,
  },
};

export function useMockAuth(): { user: typeof mockSession.user | undefined; isLoading: boolean } {
  return {
    user: mockSession.user,
    isLoading: false,
  };
}
