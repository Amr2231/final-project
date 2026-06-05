// ===================== MOVE =====================
// Transfers the doctor's patients to another doctor, then deactivates them.
"use client";
import { getDoctorsAction } from "@/features/admin/actions/users.actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InactiveUser } from "@/lib/types/admin";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

// onConfirm receives (userId, newDoctorId) — both are numbers.
type MoveProps = {
  user: InactiveUser | null;
  onClose: () => void;
  onConfirm: (id: number, newDoctorId: number) => void;
  isPending?: boolean;
};

export function TransferModal({
  user,
  onClose,
  onConfirm,
  isPending,
}: MoveProps) {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [errors, setErrors] = useState<{ doctor?: string }>({});

  // Fetch active doctors from backend
  const { data: doctorsData, isLoading: loadingDoctors } = useQuery({
    queryKey: ["doctors-active"],
    queryFn: getDoctorsAction,
    enabled: !!user,
    staleTime: 60_000,
  });

  const doctors = doctorsData?.data ?? [];

  if (!user) return null;

  const validate = () => {
    const e: { doctor?: string } = {};
    if (!selectedDoctorId) e.doctor = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConfirm = () => {
    if (!validate()) return;
    onConfirm(user.id, Number(selectedDoctorId));
    onClose();
  };

  return (
    <Dialog open={!!user} onOpenChange={(v) => !v && onClose()}>
      <DialogContent key={user.id} className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900">
            Transfer Patients & Deactivate
          </DialogTitle>
          <DialogDescription className="text-sm text-[#8B1A2B]">
            Select a doctor to transfer all patients to before deactivating this
            user
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-0.5">
            <p className="text-xs text-gray-400">User to be deactivated</p>
            <p className="text-sm font-semibold text-gray-900">
              {user.fName} {user.lName}
            </p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>

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
              className={`w-full h-9 rounded-md border px-3 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1A2B]/20 focus:border-[#8B1A2B] ${
                errors.doctor ? "border-red-400" : "border-gray-200"
              }`}
            >
              <option value="">
                {loadingDoctors ? "Loading doctors..." : "Select doctor"}
              </option>
              {doctors
                .filter((d) => d.user_id !== user.id) // exclude the user being deactivated
                .map((d) => (
                  <option key={d.user_id} value={d.user_id}>
                    {d.first_name} {d.last_name}
                  </option>
                ))}
            </select>
            {errors.doctor && (
              <p className="text-xs text-red-500">{errors.doctor}</p>
            )}
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            All patients assigned to this doctor will be transferred to the
            selected doctor. This user will then be deactivated.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={isPending || loadingDoctors}
            onClick={handleConfirm}
            className="bg-[#8B1A2B] hover:bg-[#7a1726] text-white"
          >
            {isPending ? "Processing..." : "Transfer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}