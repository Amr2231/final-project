"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import logo from "../../../../../public/logo.jpeg";
import Image from "next/image";

type ForgotPasswordFormProps = {
  email: string;
  onSuccess?: (token: string) => void;
  onBack: () => void;
};

export default function ForgotPasswordForm({ email }: ForgotPasswordFormProps) {
  return (
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 pb-9">
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

      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
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
        Check your email
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        We sent a password reset link to:{" "}
        <span className="font-bold text-blue-800 dark:text-blue-400">
          {email}
        </span>
      </p>
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">
        The link expires in 15 minutes. If you don&apos;t see it, check your
        spam folder.
      </p>

      <Link
        href="/login"
        className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-900 dark:hover:text-blue-400 flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to login
      </Link>
    </motion.div>
  );
}
