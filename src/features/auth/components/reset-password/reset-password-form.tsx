"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { MoveRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import SubmissionFeedback from "@/components/shared/submission-feedback";
import useResetPassword from "../../hooks/use-reset-password";
import { resetSchema, ResetFields } from "@/lib/schemas/auth.schema";

// component
export default function ResetPasswordForm({ token }: { token: string }) {
  // hooks
  const { isPending, error, success, resetPassword } = useResetPassword(token);

  // Initialize the form with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFields>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  // Handle form submission
  const onSubmit = (data: ResetFields) => resetPassword(data);

  // Render the reset password form
  if (!token) {
    return (
      <div className="text-center">
        {/* Error message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Invalid Link</h1>
        <p className="text-gray-500 mb-6">
          This reset link is invalid or has expired.
        </p>
        {/* Link to request a new link */}
        <Link
          href="/forgot-password"
          className="text-red-800 hover:text-red-900 font-medium"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  // Show success message and redirect if password reset is successful
  if (success) {
    return (
      <motion.div
        className="w-full max-w-md text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Logo */}
        <div className="flex gap-3 mb-10">
          <div className="w-10 h-10 rounded-lg bg-blue-800 flex items-center justify-center">
            <span className="text-white font-bold text-base">M</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">Echo vision</span>
        </div>

        {/* success icon */}
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Success message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Password Reset!
        </h1>
        <p className="text-gray-500 mb-2">
          Your password has been changed successfully.
        </p>
        <p className="text-sm text-gray-400">Redirecting to login...</p>
      </motion.div>
    );
  }

  // Render the form with error state if token is valid but reset failed
  return (
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Link to go back to login */}
      <Link
        href="/login"
        className="flex items-center gap-2 mb-8 -ml-2 text-gray-600 hover:text-blue-900 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to login
      </Link>

      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-lg bg-blue-800 flex items-center justify-center">
          <span className="text-white font-bold text-base">M</span>
        </div>
        <span className="text-xl font-semibold text-gray-900">Echo vision</span>
      </div>

      {/* Form */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Reset Password
        </h1>
        <p className="text-sm text-gray-500">Enter your new password below.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          {/* New Password */}
          <Label>New Password</Label>
          <PasswordInput
            placeholder="Enter new password"
            {...register("password")}
            error={!!errors.password}
          />
          {errors.password && (
            <p className="text-sm text-red-800">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label>Confirm Password</Label>
          <PasswordInput
            placeholder="Confirm new password"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-800">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Error message */}
        <SubmissionFeedback>{(error as Error)?.message}</SubmissionFeedback>

        {/* Submit button */}
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Resetting..." : "Reset Password"}
          <MoveRight className="w-4 h-4" />
        </Button>
      </form>
    </motion.div>
  );
}
