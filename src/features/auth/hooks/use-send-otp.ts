import { sendResetLinkAction  } from "@/features/auth/actions/auth.actions";
import { EmailStepFields } from "@/lib/types/auth";
import { useMutation } from "@tanstack/react-query";

export default function useEmail() {
  // Mutation
  const { isPending, error, mutate } = useMutation({
    mutationFn: async (fields: EmailStepFields) => {
      const payload = await sendResetLinkAction (fields);
      console.log("payload:", payload);
      return payload;
    },

    // On successful login, redirect based on role or callback URL
    // onSuccess: async () => {
    //     toast.success("OTP sent successfully!");    
    // },
  });
  return { isPending, error, sendOtp: mutate };
}
