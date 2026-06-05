"use server";

import { deleteStudyNote, saveStudyNotes } from "../api/notes.api";

export async function savePatientNotesAction(
  study_id: string,
  notes: string,
  note_id?: string | null,
) {
  return saveStudyNotes(study_id, notes, note_id);
}

export async function deletePatientNoteAction(study_id: string, note_id: string) {
  return deleteStudyNote(study_id, note_id);
}
