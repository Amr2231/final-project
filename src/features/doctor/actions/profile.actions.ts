"use server";

import {
  changePasswordDoctorAction,
  updateProfileAction,
} from "@/features/settings/actions/profile.actions";
import type { PersonalInfoFormValues } from "@/lib/shared/schemas/settings.schema";

export async function updateMyProfileAction(payload: PersonalInfoFormValues) {
  return updateProfileAction(payload);
}

export async function changePasswordAction(payload: {
  current_password: string;
  new_password: string;
  confirm_password: string;
}) {
  return changePasswordDoctorAction(payload);
}
