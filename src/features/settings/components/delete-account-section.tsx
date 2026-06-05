"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteAccount } from "../hooks/use-delete-account";

export function DeleteAccountSection() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const { mutate: deleteAccount, isPending } = useDeleteAccount();

  const canConfirm = password.length > 0 && confirmText === "DELETE";

  const handleClose = () => {
    setOpen(false);
    setPassword("");
    setConfirmText("");
  };

  const handleDelete = () => {
    if (!canConfirm) return;
    deleteAccount(password, {
      onSettled: () => handleClose(),
    });
  };

  return (
    <>
      <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 space-y-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Delete account</p>
            <p className="text-sm text-blue-800/80 mt-1">
              Permanently remove your account and sign out. This action cannot be undone.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={() => setOpen(true)}
        >
          Delete my account
        </Button>
      </div>

      <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete your account?</DialogTitle>
            <DialogDescription>
              Enter your password and type DELETE to confirm. You will be signed out immediately.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="delete-password">Password</Label>
              <Input
                id="delete-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="delete-confirm">Type DELETE to confirm</Label>
              <Input
                id="delete-confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={!canConfirm || isPending}
              onClick={handleDelete}
            >
              {isPending ? "Deleting..." : "Delete account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
