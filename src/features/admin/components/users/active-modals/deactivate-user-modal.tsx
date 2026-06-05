"use client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/lib/types/admin";
import { getDoctorsAction } from "../../../actions/users.actions";
type DeactivateProps = {
  user: User | null;
  onClose: () => void;
  onConfirm: (newDoctorId?: number) => void;
  isPending?: boolean;
};

export function DeactivateUserModal({
  user,
  onClose,
  onConfirm,
  isPending,
}: DeactivateProps) {
  const isDoctor = user?.role_name === "Doctor";

  useQuery({
    queryKey: ["doctors-active"],
    queryFn: getDoctorsAction,
    enabled: isDoctor && !!user,
    staleTime: 60_000,
  });

  if (!user) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog open={!!user} onOpenChange={(v) => !v && onClose()}>
      <DialogContent key={user.user_id} className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900">
            Deactivate Account
          </DialogTitle>
          <DialogDescription className="text-sm text-orange-600">
            {isDoctor
              ? "This doctor has patients. Select a doctor to transfer them to first."
              : "This user will lose access to the system."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-0.5">
            <p className="text-xs text-gray-400">User to be deactivated</p>
            <p className="text-sm font-semibold text-gray-900">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-xs text-gray-500">{user.role_name}</p>
          </div>

          {/* {isDoctor && (
            <div className="space-y-1.5">
              <p className="text-xs text-gray-500">
                Transfer Patients To <span className="text-[#8B1A2B]">*</span>
              </p>
              <select
                value={selectedDoctorId}
                onChange={(e) => {
                  setSelectedDoctorId(e.target.value);
                  setErrors({});
                }}
                disabled={loadingDoctors}
                className={cn(
                  "w-full h-9 rounded-md border px-3 text-sm text-gray-700 bg-white",
                  "focus:outline-none focus:ring-2 focus:ring-[#8B1A2B]/20 focus:border-[#8B1A2B]",
                  errors.doctor ? "border-red-400" : "border-gray-200",
                )}
              >
                <option value="">
                  {loadingDoctors ? "Loading doctors..." : "Select doctor"}
                </option>
                {doctors.map((d) => (
                  <option key={d.user_id} value={d.user_id}>
                    {d.first_name} {d.last_name}
                  </option>
                ))}
              </select>
              {errors.doctor && (
                <p className="text-xs text-red-500">{errors.doctor}</p>
              )}
              <p className="text-xs text-gray-400">
                All patients will be transferred before deactivation.
              </p>
            </div>
          )} */}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={isPending }
            onClick={handleConfirm}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isPending
              ? isDoctor
                ? "Transferring..."
                : "Deactivating..."
              : "Deactivate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
