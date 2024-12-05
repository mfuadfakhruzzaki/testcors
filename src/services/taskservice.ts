// src/services/taskService.ts
import apiClient from "./apiClient";

export async function getTasksByProject(projectId: number) {
  return apiClient.get(`/projects/${projectId}/tasks`);
}

export async function getTaskDetails(projectId: number, taskId: number) {
  return apiClient.get(`/projects/${projectId}/tasks/${taskId}`);
}

export async function createTask(projectId: number, data: any) {
  return apiClient.post(`/projects/${projectId}/tasks`, data);
}

export async function updateTask(projectId: number, taskId: number, data: any) {
  return apiClient.put(`/projects/${projectId}/tasks/${taskId}`, data);
}

export async function deleteTask(projectId: number, taskId: number) {
  return apiClient.delete(`/projects/${projectId}/tasks/${taskId}`);
}
