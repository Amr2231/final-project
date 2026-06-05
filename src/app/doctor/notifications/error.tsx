"use client";

import { Button } from "@/components/ui/button";

export default function NotificationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
        Something went wrong loading notifications
      </p>
      <p className="text-xs text-gray-500 max-w-sm text-center">
        {error.message || "An unexpected error occurred."}
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={reset}
        className="text-[#8B1A2B] border-[#8B1A2B]/30"
      >
        Try again
      </Button>
    </div>
  );
}
