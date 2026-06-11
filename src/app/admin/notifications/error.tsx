"use client";

import { Button } from "@/components/ui/button";

// AdminNotificationsError component
export default function AdminNotificationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      {/* Display error message */}
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
        Something went wrong loading notifications
      </p>
      <p className="text-xs text-gray-500 max-w-sm text-center">
        {/* Display error message */}
        {error.message || "An unexpected error occurred."}
      </p>
      {/* Button to try again */}
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
