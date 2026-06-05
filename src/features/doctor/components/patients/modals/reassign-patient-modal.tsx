"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
type ReassignForm = { doctor: string; study: string; date: string };
const DOCTORS = [
  "Dr. Ahmed Hassan",
  "Dr. Sara Mostafa",
  "Dr. Mohamed Ali",
  "Dr. Nour Ibrahim",
  "Dr. Khaled Youssef",
];
import { STUDY } from "@/lib/constants/study.constants";
export function ReassignModal({
  patient,
  onClose,
  onSave,
}: {
  patient: {
    national_id: string;
    first_name: string;
    last_name: string;
  } | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState<ReassignForm>({
    doctor: "",
    study: "",
    date: "",
  });

  const handleClose = () => {
    setForm({ doctor: "", study: "", date: "" });
    onClose();
  };

  return (
    <Dialog open={!!patient} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900">
            Reassign Doctor
          </DialogTitle>
          <DialogDescription className="text-sm text-blue-800">
            Reassign {patient?.first_name} {patient?.last_name} to a new
            appointment
          </DialogDescription>
        </DialogHeader>
        {patient && (
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-blue-900">First Name</p>
                <p className="text-sm font-medium">{patient.first_name}</p>
              </div>
              <div>
                <p className="text-xs text-blue-900">Last Name</p>
                <p className="text-sm font-medium">{patient.last_name}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-blue-900">National ID</p>
                <p className="text-sm font-medium font-mono">
                  {patient.national_id}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Assigned Doctor
                </label>
                <Select
                  value={form.doctor}
                  onValueChange={(v) => setForm((p) => ({ ...p, doctor: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCTORS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <label className="text-sm font-medium text-gray-700">
                  Study
                </label>
                <Select
                  value={form.study}
                  onValueChange={(v) => setForm((p) => ({ ...p, study: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a study" />
                  </SelectTrigger>
                  <SelectContent>
                    {STUDY.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Study date
                </label>
                <Input
                  type="date"
                  value={form.date}
                  className="h-10 text-sm"
                  onChange={(e) =>
                    setForm((p) => ({ ...p, date: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="default"
            disabled={!form.doctor || !form.date}
            onClick={() => {
              onSave();
              handleClose();
            }}
          >
            Reassign Patient
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
