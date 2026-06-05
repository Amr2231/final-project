"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { User } from "@/lib/types/admin";
import { cn } from "@/lib/utils/tailwind-merge";
import { editUserSchema, EditUserSchema } from "@/lib/schemas/admin.schema";
export type { EditUserSchema as EditUserPayload } from "@/lib/schemas/admin.schema";

type EditProps = {
  user: User | null;
  onClose: () => void;
  onSave: (id: number, payload: EditUserSchema) => void;
  isPending?: boolean;
};

function FieldLabel({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <label className="text-xs text-gray-500 font-medium">
      {label} {required && <span className="text-blue-800">*</span>}
    </label>
  );
}

export function EditUserModal({ user, onClose, onSave, isPending }: EditProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditUserSchema>({
    resolver: zodResolver(editUserSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        username: user.username ?? "",
        email: user.email ?? "",
      });
    }
  }, [user, reset]);

  if (!user) return null;

  return (
    <Dialog open={!!user} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900">
            Edit User
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Update information for {user.first_name} {user.last_name}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <FieldLabel label="First Name" required />
            <Input
              {...register("first_name")}
              className={cn(
                "h-9 text-sm bg-gray-50",
                errors.first_name && "border-red-400",
              )}
            />
            {errors.first_name && (
              <p className="text-xs text-red-500">
                {errors.first_name.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <FieldLabel label="Last Name" required />
            <Input
              {...register("last_name")}
              className={cn(
                "h-9 text-sm bg-gray-50",
                errors.last_name && "border-red-400",
              )}
            />
            {errors.last_name && (
              <p className="text-xs text-red-500">{errors.last_name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <FieldLabel label="Username" required />
            <Input
              {...register("username")}
              className={cn(
                "h-9 text-sm bg-gray-50 font-mono",
                errors.username && "border-red-400",
              )}
            />
            {errors.username && (
              <p className="text-xs text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <FieldLabel label="Email" required />
            <Input
              type="email"
              {...register("email")}
              className={cn(
                "h-9 text-sm bg-gray-50",
                errors.email && "border-red-400",
              )}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={isPending}
            onClick={handleSubmit((data) => onSave(user.user_id, data))}
            className="bg-blue-800 hover:bg-blue-900 text-white"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
