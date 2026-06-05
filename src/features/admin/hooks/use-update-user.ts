import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserAction } from "../actions/users.actions";
import type { UpdateUserPayload } from "@/lib/types/admin";
import { toast } from "sonner";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateUserPayload }) =>
      updateUserAction(id, payload),

    onSuccess: (data) => {
      if (data.message === "User updated") {
        toast.success("User updated successfully!");
        queryClient.invalidateQueries({
          queryKey: ["users"],
        });

        return;
      }

      const error = data.error ?? "";

      if (error.includes("username")) {
        toast.error("This username is already taken");
      } else if (error.includes("email")) {
        toast.error("This email address is already in use");
      } else {
        toast.error("Unable to update user");
      }
    },

    onError: (error: Error) => {
      const message = error.message || "";

      if (message.includes("username")) {
        toast.error("This username is already taken");
      } else if (message.includes("email")) {
        toast.error("This email address is already in use");
      } else {
        toast.error("Network error, please try again");
      }
    },
  });
}
