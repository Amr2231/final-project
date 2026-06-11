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
import logo from "../../../../../public/logo.jpeg";
import Image from "next/image";

export default function ResetPasswordForm({ token }: { token: string }) {
  const { isPending, error, success, resetPassword } = useResetPassword(token);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFields>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = (data: ResetFields) => resetPassword(data);

  if (!token) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Invalid Link
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          This reset link is invalid or has expired.
        </p>
        <Link
          href="/forgot-password"
          className="text-red-800 hover:text-red-900 font-medium"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <motion.div
        className="w-full max-w-md text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm shrink-0">
            <Image
              src={logo}
              alt="Echo Vision Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xl font-semibold text-gray-900 dark:text-white">
            Echo vision
          </span>
        </div>

        {/* Success icon */}
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6 mx-auto">
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

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Password Reset!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-2">
          Your password has been changed successfully.
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Redirecting to login...
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back link */}
      <Link
        href="/login"
        className="flex items-center gap-2 mb-8 -ml-2 text-gray-600 dark:text-gray-400 hover:text-blue-900 dark:hover:text-blue-400 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to login
      </Link>

      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm shrink-0">
          <Image
            src={logo}
            alt="Echo Vision Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-xl font-semibold text-gray-900 dark:text-white">
          Echo vision
        </span>
      </div>

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          Reset Password
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
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

        <SubmissionFeedback>{(error as Error)?.message}</SubmissionFeedback>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Resetting..." : "Reset Password"}
          <MoveRight className="w-4 h-4" />
        </Button>
      </form>
    </motion.div>
  );
}
