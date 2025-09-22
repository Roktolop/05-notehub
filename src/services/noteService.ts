import type { Note, NoteTag } from '../types/note'
import axios from 'axios'

const API_KEY = import.meta.env.VITE_NOTEHUB_TOKEN;

export interface FetchNotesResponse {
  notes: Note[],
  totalPages: number,
}

export interface CreateNoteProps {
  title: string,
  content: string,
  tag: NoteTag,
}

export interface DeleteNoteProps {
  id: string,
}

export const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export async function fetchNotes(searchText: string, page: number): Promise<FetchNotesResponse> {
  const response = await api.get<FetchNotesResponse>("/notes", {
    params: {
      ...(searchText !== "" && { search: searchText }),
      page,
      perPage: 15,
    },
  });

  console.log(response.data);

  return response.data;
};

export async function createNote(data: CreateNoteProps): Promise<Note> {
  const response = await api.post<Note>(`/notes`, data);

  return response.data;
}

export async function deleteNote({ id }: DeleteNoteProps): Promise<Note> {
  const response = await api.delete<Note>(`/notes/${id}`)

  console.log(response.data)

  return response.data
}