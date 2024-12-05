/* eslint-disable @typescript-eslint/no-explicit-any */
// AuthContext.ts
import { createContext } from "react";

export interface AuthContextProps {
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | null>(null);
