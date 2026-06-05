"use server";

import { insertAiFindings } from "../api/reports.api";
import {
  downloadReportPdf,
  getFullReport,
  getOpenReport,
  getReportDetail,
  saveDraft,
  signReport,
} from "../services/reports.service";
import type { MutationResponse, SaveReportPayload } from "@/lib/types/doctor";

export async function openReportAction(study_id: string) {
  return getOpenReport(study_id);
}

export async function getReportAction(study_id: string) {
  return getReportDetail(study_id);
}

export async function getFullReportAction(study_id: string) {
  return getFullReport(study_id);
}

export async function saveReportDraftAction(
  study_id: string,
  payload: SaveReportPayload,
): Promise<MutationResponse> {
  return saveDraft(study_id, payload);
}

export async function signReportAction(
  study_id: string,
  payload: SaveReportPayload,
): Promise<MutationResponse> {
  return signReport(study_id, payload);
}

export async function exportReportPDFAction(study_id: string): Promise<Blob> {
  return downloadReportPdf(study_id);
}

export async function insertAiFindingsAction(
  study_id: string,
  doctorInterpretation: string,
): Promise<MutationResponse> {
  return insertAiFindings(study_id, doctorInterpretation);
}
