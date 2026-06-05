"use server";

import { deleteStudyImage, fetchStudyImage } from "../api/images.api";

export async function getStudyImageAction(study_id: string, image_id: number) {
  return fetchStudyImage(study_id, image_id);
}

export async function deleteStudyImageAction(study_id: string, image_id: number) {
  return deleteStudyImage(study_id, image_id);
}
