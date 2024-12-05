/* eslint-disable @typescript-eslint/no-explicit-any */
// src/contexts/AuthProvider.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
  children: React.ReactNode;
}

// Hapus atau sesuaikan pengaturan baseURL
// axios.defaults.baseURL = "/api"; // Tidak diperlukan jika path permintaan sudah lengkap

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem("token");
    console.log("Token dari localStorage:", storedToken);
    return storedToken;
  });

  const isAuthenticated = !!token;

  useEffect(() => {
    console.log("Token saat ini:", token);
    axios.defaults.headers.common["Authorization"] = token
      ? `Bearer ${token}`
      : "";
  }, [token]);

  // Menambahkan Axios Interceptors
  useEffect(() => {
    // Interceptor Request
    const requestInterceptor = axios.interceptors.request.use(
      (request) => {
        console.log("Memulai Request", {
          method: request.method,
          url: request.url,
          data: request.data,
          headers: request.headers,
        });
        return request;
      },
      (error) => {
        console.error("Error Request", error);
        return Promise.reject(error);
      }
    );

    // Interceptor Response
    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        console.log("Response:", {
          status: response.status,
          data: response.data,
          headers: response.headers,
        });
        return response;
      },
      (error) => {
        console.error("Error Response", {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
          config: error.config,
        });
        return Promise.reject(error);
      }
    );

    // Fungsi cleanup untuk menghapus interceptor saat komponen unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        "https://api.zacht.tech/auth/login", // Gunakan path tanpa '/api'
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Login Response:", response.data);
      const token = response.data.token || response.data.data?.token;
      if (token) {
        setToken(token);
        localStorage.setItem("token", token);
      } else {
        throw new Error("Token tidak ditemukan dalam respons");
      }
    } catch (error: any) {
      console.error("Login gagal:", error);
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      await axios.post("https://api.zacht.tech/auth/register", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Registrasi gagal:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post("https://api.zacht.tech/auth/logout");
    } catch (error) {
      console.error("Logout gagal:", error);
    } finally {
      setToken(null);
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
