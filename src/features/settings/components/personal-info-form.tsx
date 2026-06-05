"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useZodForm } from "@/lib/shared/forms/create-zod-form";
import { FormFieldError } from "@/lib/shared/forms/form-field-error";
import {
  personalInfoSchema,
  type PersonalInfoFormValues,
} from "@/lib/shared/schemas/settings.schema";
import { useUpdateProfile } from "../hooks/use-update-profile";

export function PersonalInfoForm() {
  const { data: session } = useSession();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useZodForm(personalInfoSchema, {
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
    },
  });

  useEffect(() => {
    if (!session?.user) return;

    const fullName = session.user.name?.trim() ?? "";
    const nameParts = fullName.split(/\s+/).filter(Boolean);
    const first_name = nameParts[0] ?? "";
    const last_name = nameParts.slice(1).join(" ");

    reset({
      first_name,
      last_name,
      username: session.user.username ?? "",
      email: session.user.email ?? "",
    });
  }, [session, reset]);

  const onSubmit = (data: PersonalInfoFormValues) => {
    updateProfile(data);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm text-gray-600">First Name</Label>
          <Input
            {...register("first_name")}
            className="h-10 bg-gray-50 border-gray-200 text-sm"
          />
          <FormFieldError error={errors.first_name} />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm text-gray-600">Last Name</Label>
          <Input
            {...register("last_name")}
            className="h-10 bg-gray-50 border-gray-200 text-sm"
          />
          <FormFieldError error={errors.last_name} />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm text-gray-600">Username</Label>
          <Input
            {...register("username")}
            className="h-10 bg-gray-50 border-gray-200 text-sm font-mono"
          />
          <FormFieldError error={errors.username} />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm text-gray-600">Email Address</Label>
          <Input
            type="email"
            {...register("email")}
            className="h-10 bg-gray-50 border-gray-200 text-sm"
          />
          <FormFieldError error={errors.email} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isPending}
          className="h-9 bg-blue-800 hover:bg-blue-900 text-white gap-2 text-sm"
        >
          <Save className="w-3.5 h-3.5" />
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
