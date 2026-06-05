import { InactiveUser } from "@/lib/types/admin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
// ===================== REACTIVATE =====================
type ReactivateProps = {
  user: InactiveUser | null;
  onClose: () => void;
  onConfirm: (id: number) => void;
  isPending?: boolean;
};

export function ReactivateModal({
  user,
  onClose,
  onConfirm,
  isPending,
}: ReactivateProps) {
  if (!user) return null;

  return (
    <Dialog open={!!user} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900">
            Reactivate Account
          </DialogTitle>
          <DialogDescription className="text-sm text-[#8B1A2B]">
            Confirm account reactivation
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 space-y-4">
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-50 border border-green-100">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-gray-900">
                Reactivate {user.fName} {user.lName}?
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">
                This account will be moved back to{" "}
                <span className="font-medium">Active</span> status and the user
                will regain full access.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-0.5">
            <p className="text-xs text-gray-400">Account</p>
            <p className="text-sm font-semibold text-gray-900">
              {user.fName} {user.lName}
            </p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={isPending}
            onClick={() => onConfirm(user.id)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isPending ? "Reactivating..." : "Yes, Reactivate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
