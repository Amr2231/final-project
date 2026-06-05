"use server";

import * as scheduleApi from "../api/schedule.api";

export async function fetchDoctorScheduleAction() {
  return scheduleApi.fetchDoctorSchedule();
}

export async function saveDoctorScheduleAction(
  days: scheduleApi.DoctorScheduleDay[],
) {
  return scheduleApi.saveDoctorSchedule(days);
}

export async function addDoctorHolidayAction(payload: {
  holiday_date: string;
  reason?: string;
}) {
  return scheduleApi.addDoctorHoliday(payload);
}

export async function removeDoctorHolidayAction(holidayId: number) {
  return scheduleApi.removeDoctorHoliday(holidayId);
}
