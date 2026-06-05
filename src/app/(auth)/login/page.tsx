import { LoginForm } from "@/features/auth";

// metadata for login page
export const metadata = {
  title: "Login | Echo vision",
  description: "Sign in to your Echo vision account",
  icon: "/window.svg",
};

// login page component
export default function LoginPage() {
  return (
    <main>
      <LoginForm />
    </main>
  );
}
