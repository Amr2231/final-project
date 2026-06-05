"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  ArrowLeft,
  User,
  ShieldCheck,
  KeyRound,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import Link from "next/link";
import { useAddUser } from "../../hooks/use-add-user";
import { addUserSchema, type AddUserSchema } from "@/lib/schemas/admin.schema";
import { ROLES } from "@/lib/constants/roles.constants";

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
  index = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
      className="rounded-2xl border border-gray-200 bg-white overflow-hidden"
    >
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/60">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#8B1A2B]/10">
          <Icon className="w-4 h-4 text-[#8B1A2B]" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );
}

function FieldLabel({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
      {label} {required && <span className="text-[#8B1A2B]">*</span>}
    </label>
  );
}

export function AddUserForm() {
  const { mutate: addUser, isPending } = useAddUser();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddUserSchema>({
    resolver: zodResolver(addUserSchema),
  });

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
    const pwd = Array.from(
      { length: 12 },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");
    setValue("password", pwd);
    setValue("confirm_password", pwd);
  };

  return (
    <div className="space-y-6">
      {/* Loading */}
      {/* {isPending && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
          <div className="animate-spin w-6 h-6 border-2 border-[#8B1A2B] border-t-transparent rounded-full" />
        </div>
      )} */}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3"
      >
        <Link
          href="/admin/users"
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-[#8B1A2B] hover:border-[#8B1A2B]/30 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New User</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Register a new user account in the system
          </p>
        </div>
      </motion.div>

      {/* Personal Information */}
      <SectionCard
        icon={User}
        title="Personal Information"
        description="Enter the user's basic details"
        index={0}
      >
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <FieldLabel label="First Name" required />
            <Input
              placeholder="e.g. John"
              {...register("first_name")}
              className={cn(
                "h-10 bg-gray-50 border-gray-200 text-sm",
                errors.first_name && "border-red-400",
              )}
            />
            {errors.first_name && (
              <p className="text-xs text-red-500">
                {errors.first_name.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <FieldLabel label="Last Name" required />
            <Input
              placeholder="e.g. Smith"
              {...register("last_name")}
              className={cn(
                "h-10 bg-gray-50 border-gray-200 text-sm",
                errors.last_name && "border-red-400",
              )}
            />
            {errors.last_name && (
              <p className="text-xs text-red-500">{errors.last_name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <FieldLabel label="Username" required />
            <Input
              placeholder="e.g. john_smith"
              {...register("username")}
              className={cn(
                "h-10 bg-gray-50 border-gray-200 text-sm",
                errors.username && "border-red-400",
              )}
            />
            {errors.username && (
              <p className="text-xs text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <FieldLabel label="Email Address" required />
            <Input
              type="email"
              placeholder="e.g. john@medidash.com"
              {...register("email")}
              className={cn(
                "h-10 bg-gray-50 border-gray-200 text-sm",
                errors.email && "border-red-400",
              )}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>
      </SectionCard>

      {/* Account Information */}
      <SectionCard
        icon={ShieldCheck}
        title="Account Information"
        description="Set the user's role"
        index={1}
      >
        <div className="space-y-1.5">
          <FieldLabel label="Role" required />
          <select
            {...register("role_name")}
            className={cn(
              "w-full h-10 rounded-md border px-3 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#8B1A2B]/20 focus:border-[#8B1A2B]",
              errors.role_name ? "border-red-400" : "border-gray-200",
            )}
          >
            <option value="">Select role</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {errors.role_name && (
            <p className="text-xs text-red-500">{errors.role_name.message}</p>
          )}
        </div>
      </SectionCard>

      {/* Security */}
      <SectionCard
        icon={KeyRound}
        title="Security"
        description="Set a password for this account"
        index={2}
      >
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <FieldLabel label="Password" required />
            <div className="flex gap-2">
              <PasswordInput
                placeholder="Enter password"
                {...register("password")}
                error={!!errors.password}
                className="bg-gray-50 border-gray-200"
              />
              <Button
                type="button"
                variant="outline"
                onClick={generatePassword}
                className="h-10 px-2.5 text-[#8B1A2B] border-[#8B1A2B]/30 hover:bg-[#8B1A2B]/5 shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
            </div>
            {errors.password ? (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            ) : (
              <p className="text-xs text-gray-400">Min 8 characters</p>
            )}
          </div>

          <div className="space-y-1.5">
            <FieldLabel label="Confirm Password" required />
            <PasswordInput
              placeholder="Confirm password"
              {...register("confirm_password")}
              error={!!errors.confirm_password}
              className="bg-gray-50 border-gray-200"
            />
            {errors.confirm_password && (
              <p className="text-xs text-red-500">
                {errors.confirm_password.message}
              </p>
            )}
          </div>
        </div>
      </SectionCard>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="flex justify-end gap-2 pb-4"
      >
        <Button
          onClick={handleSubmit((data) => addUser(data))}
          disabled={isPending}
          className="h-9 bg-[#8B1A2B] hover:bg-[#7a1726] text-white text-sm"
        >
          {isPending ? "Creating..." : "Create User"}
        </Button>
      </motion.div>
    </div>
  );
}
