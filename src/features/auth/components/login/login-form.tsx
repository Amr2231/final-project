"use client";

import { motion } from "framer-motion";
import { User, Lock } from "lucide-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { loginSchema } from "@/lib/schemas/auth.schema";
import { LoginFields } from "@/lib/types/auth";
import { useLogin } from "@/features/auth/hooks/use-login";
import SubmissionFeedback from "@/components/shared/submission-feedback";

// component
export default function LoginForm() {
  // Mutation hook to handle login logic
  const { isPending, error, login } = useLogin();

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  // Destructure necessary methods and state from the form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  // Handle form submission
  const onSubmit: SubmitHandler<LoginFields> = (values) => {
    login(values);
  };

  // Render the login form
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-lg bg-blue-800 flex items-center justify-center">
          <span className="text-white font-bold text-base">E</span>
        </div>
        <span className="text-xl font-semibold text-gray-900">Echo vision</span>
      </div>

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Let&apos;s get started
        </h1>
        <p className="text-sm text-gray-500">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="email"
              {...register("email")}
              placeholder="Enter your email"
              className="pl-10"
              error={!!errors.email}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-800">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10 text-gray-400" />
            <PasswordInput
              id="password"
              {...register("password")}
              className="pl-10"
              placeholder="Enter your password"
              error={!!errors.password}
            />
          </div>
          {errors.password && (
            <p className="text-sm text-red-800">{errors.password.message}</p>
          )}
          <div className="text-end">
            <Link href="/forgot-password" className="text-blue-800 text-sm">
              Forgot your password?
            </Link>
          </div>
        </div>

        {/* Remember Me */}
        <Controller
          name="rememberMe"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor="remember" className="cursor-pointer font-normal">
                Remember me
              </Label>
            </div>
          )}
        />

        {/* feedback */}
        <SubmissionFeedback>{error?.message}</SubmissionFeedback>

        {/* submit button */}
        <Button
          variant="default"
          disabled={isPending || !form.formState.isValid}
          type="submit"
          className = "w-full"
        >
          Sign in
        </Button>
      </form>
    </motion.div>
  );
}
