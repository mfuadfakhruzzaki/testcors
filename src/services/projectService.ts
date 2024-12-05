import apiClient from "./apiClient";

export async function fetchAllProjects(token: string) {
  try {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await apiClient.get("/projects");
    const projectData = response.data.data || response.data.projects || [];
    if (!Array.isArray(projectData)) {
      throw new Error("Struktur data proyek tidak sesuai.");
    }
    return projectData;
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}

export async function fetchProjectById(token: string, projectId: number) {
  try {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await apiClient.get(`/projects/${projectId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching project details:", error);
    throw error;
  }
}

