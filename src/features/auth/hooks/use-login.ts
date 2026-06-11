import { LoginFields } from "@/lib/types/auth";
import { useMutation } from "@tanstack/react-query";
import { signIn, getSession } from "next-auth/react";
import { toast } from "sonner";

// Redirects based on user role after login
const ROLE_REDIRECTS: Record<string, string> = {
  Admin: "/admin",
  Doctor: "/doctor",
  Receptionist: "/receptionist",
};

// Custom hook to handle login logic
export function useLogin() {
  // useMutation to handle the login process
  const { isPending, error, mutate } = useMutation({
    // The mutation function that performs the login using NextAuth's signIn method
    mutationFn: async (credentials: LoginFields) => {
      const response = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        rememberMe: String(credentials.rememberMe),
        redirect: false,
      });

      if (!response?.ok) {
        throw new Error(response?.error || "Login failed");
      }

      // wait for 200ms
      await new Promise((resolve) => setTimeout(resolve, 200));

      await fetch("/api/auth/session-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rememberMe: credentials.rememberMe }),
      });
    },

    // success login
    onSuccess: async () => {
      const session = await getSession();
      const role = session?.role;
      toast.success("Logged in successfully!", {
        duration: 1500,
        onAutoClose: () => {
          // Redirect user to their respective home page based on their role after successful login
          location.href = ROLE_REDIRECTS[role ?? ""] ?? "/";
        },
      });
    },
  });
  return { isPending, error, login: mutate };
}
