import type { Note, NoteTag } from '../types/note'
import axios from 'axios'

const API_KEY = import.meta.env.VITE_NOTEHUB_TOKEN;

export interface FetchNotesProps {
  notes: Note[],
  totalPages: number,
}

export interface CreateNoteProps {
  title?: string,
  content: string,
  tag: NoteTag,
}

export interface DeleteNoteProps {
  id: number,
}

export const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export async function fetchNotes(value: string): Promise<FetchNotesProps> {
  const response = await api.get<FetchNotesProps>("/notes/", {
    params: {
      search: value,
      page: 1,
      perpage: 10,
    }
  });

  return response.data;
}

export async function createNote(data: CreateNoteProps): Promise<Note> { 
  const response = await api.post<Note>(`/notes`, data);

  return response.data;
}

export async function deleteNote({ id }: DeleteNoteProps): Promise<void> { 
  await api.delete<void>(`/notes/${id}`)
}