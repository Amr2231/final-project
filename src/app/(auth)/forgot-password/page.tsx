import { ForgotPasswordLayout } from "@/features/auth";

// metadata for forgot password page
export const metadata = {
  title: "Forgot Password | Echo vision",
  description: "Reset your Echo vision account password",
};

// forgot password page component
export default function ForgotPasswordPage() {
  return <ForgotPasswordLayout />;
}
