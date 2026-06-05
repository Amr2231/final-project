import { doctorFetch } from "./client";
import type { MutationResponse, StudyNote } from "@/lib/types/doctor";

export type NotesMutationResponse = MutationResponse & {
  notes?: StudyNote[];
};

export async function saveStudyNotes(
  studyId: string,
  notes: string,
  noteId?: string | null,
): Promise<NotesMutationResponse> {
  return doctorFetch<NotesMutationResponse>(`/studies/${studyId}/notes`, {
    method: "PATCH",
    body: JSON.stringify({
      notes,
      ...(noteId ? { note_id: noteId } : {}),
    }),
  });
}

export async function deleteStudyNote(
  studyId: string,
  noteId: string,
): Promise<NotesMutationResponse> {
  return doctorFetch<NotesMutationResponse>(
    `/studies/${studyId}/notes/${noteId}`,
    { method: "DELETE" },
  );
}
