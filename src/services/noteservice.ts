// src/services/noteService.ts
import apiClient from "./apiClient";

export async function getNotesByProject(projectId: number) {
  return apiClient.get(`/projects/${projectId}/notes`);
}

export async function getNoteDetails(projectId: number, noteId: number) {
  return apiClient.get(`/projects/${projectId}/notes/${noteId}`);
}

export async function createNote(projectId: number, data: { content: string }) {
  return apiClient.post(`/projects/${projectId}/notes`, data);
}

export async function updateNote(projectId: number, noteId: number, data: { content: string }) {
  return apiClient.put(`/projects/${projectId}/notes/${noteId}`, data);
}

export async function deleteNote(projectId: number, noteId: number) {
  return apiClient.delete(`/projects/${projectId}/notes/${noteId}`);
}
