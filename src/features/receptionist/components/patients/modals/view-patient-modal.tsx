import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { ActivePatient } from "@/lib/types/receptionist";

export function ViewPatientModal({
  patient,
  onClose,
}: {
  patient: ActivePatient | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!patient} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Patient Details
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            View patient information for {patient?.first_name}{" "}
            {patient?.last_name}
          </DialogDescription>
        </DialogHeader>
        {patient && (
          <div className="grid grid-cols-2 gap-4 text-sm pt-2">
            <div>
              <p className="text-gray-400 text-xs mb-0.5">First Name</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{patient.first_name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Last Name</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{patient.last_name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">National ID</p>
              <p className="font-mono font-medium text-gray-900 dark:text-gray-100">
                {patient.national_id}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Gender</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{patient.gender}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Phone</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {patient.phone_number}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Doctor Name</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{patient.doctor_name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Study Type</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {patient.study_type ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Scheduled Studies</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {patient.study_date
                  ? new Date(patient.study_date).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
