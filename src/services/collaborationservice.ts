// src/services/collaborationService.ts
import apiClient from "./apiClient";

export async function getCollaborators(projectId: number) {
  return apiClient.get(`/projects/${projectId}/collaborators`);
}

export async function addCollaborator(projectId: number, data: { user_id: number; role: string }) {
  return apiClient.post(`/projects/${projectId}/collaborators`, data);
}

export async function updateCollaborator(projectId: number, collaboratorId: number, data: { role: string }) {
  return apiClient.put(`/projects/${projectId}/collaborators/${collaboratorId}`, data);
}

export async function deleteCollaborator(projectId: number, collaboratorId: number) {
  return apiClient.delete(`/projects/${projectId}/collaborators/${collaboratorId}`);
}
