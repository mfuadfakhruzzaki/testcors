// src/apiClient.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api.zacht.tech",
  headers: { "Content-Type": "application/json" },
});

// Interceptor untuk menambahkan Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Ambil token dari localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
