import type { User } from "@/lib/types/admin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils/tailwind-merge";

export function ViewUserModal({
  user,
  onClose,
}: {
  user: User | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!user} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900">
            User Details
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            View information for {user?.first_name} {user?.last_name}
          </DialogDescription>
        </DialogHeader>

        {user && (
          <div className="grid grid-cols-2 gap-4 text-sm pt-2">
            <div>
              <p className="text-gray-400 text-xs mb-0.5">First Name</p>
              <p className="font-medium text-gray-900">{user.first_name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Last Name</p>
              <p className="font-medium text-gray-900">{user.last_name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Username</p>
              <p className="font-medium text-gray-900 font-mono">
                {user.username ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Email</p>
              <p className="font-medium text-gray-900">{user.email ?? "—"}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Role</p>
              <p className="font-medium text-gray-900">{user.role_name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Created Date</p>
              <p className="font-medium text-gray-900">
                {new Date(user.created_at).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Status</p>
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                  user.is_active === 1
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200",
                )}
              >
                {user.is_active === 1 ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-[#8B1A2B] hover:bg-[#7a1726] text-white"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
