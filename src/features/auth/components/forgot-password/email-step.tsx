"use client";

import { motion } from "framer-motion";
import { User, MoveRight, ArrowLeft } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ForgetPasswordSteps } from "@/lib/types/auth";
import { Forget_password_Steps } from "@/lib/constants/auth.constant";
import { EmailStepFields } from "@/lib/types/auth";
import { emailStepSchema } from "@/lib/schemas/auth.schema";
import useEmail from "@/features/auth/hooks/use-send-otp";
import SubmissionFeedback from "@/components/shared/submission-feedback";

// types
interface EmailStepProps {
  setStep: Dispatch<SetStateAction<ForgetPasswordSteps>>;
  setEmail: Dispatch<SetStateAction<string | null>>;
  onBack: () => void;
}

// component
export default function LoginForm({
  setStep,
  setEmail,
  onBack,
}: EmailStepProps) {
  // Mutation hook to handle login logic
  const { isPending, error, sendOtp } = useEmail();

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<EmailStepFields>({
    resolver: zodResolver(emailStepSchema()),
    defaultValues: { email: "" },
  });

  // Destructure necessary methods and state from the form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  // Handle form submission
  const onSubmit: SubmitHandler<EmailStepFields> = (values) => {
    sendOtp(values, {
      onSuccess: () => {
        setStep(Forget_password_Steps.forgot_password);
        setEmail(values.email);
      },
    });
  };

  // Render the form
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back button */}
      <Button
        type="button"
        variant="ghost"
        className="flex items-center gap-2 mb-8 -ml-2 text-gray-600 hover:text-gray-900"
        onClick={onBack}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>
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

      {/* Form */}
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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

        {/* feedback */}
        <SubmissionFeedback>{error?.message}</SubmissionFeedback>

        {/* submit button */}
        <Button
        variant="default"
          disabled={isPending || !form.formState.isValid}
          type="submit"
          className="w-full"
        >
          continue <MoveRight />
        </Button>
      </form>
    </motion.div>
  );
}
