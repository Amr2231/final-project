"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type ForgotPasswordFormProps = {
  email: string;
  onSuccess?: (token: string) => void;
  onBack: () => void;
};

export default function ForgotPasswordForm({
  email,
}: ForgotPasswordFormProps) {
  return (
    <motion.div
      className="w-full max-w-md "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-lg bg-blue-800 flex items-center justify-center">
          <span className="text-white font-bold text-base">E</span>
        </div>
        <span className="text-xl font-semibold text-gray-900">Echo vision</span>
      </div>

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

      <h1 className="text-2xl font-bold text-gray-900 mb-3">
        Check your email
      </h1>
      <p className="text-gray-500 mb-8">
        We sent a password reset link to :{" "}
        <span className="font-bold text-blue-800">{email}</span>
      </p>
      <p className="text-sm text-gray-400 mb-8">
        The link expires in 15 minutes. If you don&apos;t see it, check your
        spam folder.
      </p>

      <Link
        href="/login"
        className="text-sm text-gray-500 hover:text-blue-900 flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to login
      </Link>
    </motion.div>
  );
}
