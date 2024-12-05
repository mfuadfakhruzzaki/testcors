/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useContext } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Menggunakan AuthContext
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext harus digunakan dalam AuthProvider");
  }
  const { login } = authContext;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Menghapus error saat pengguna mulai mengetik
    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = "Email wajib diisi";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, general: "" }));

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData.email, formData.password);
      // Redirect ke dashboard setelah login berhasil
      navigate("/");
    } catch (error: any) {
      console.error("Login gagal:", error);
      if (error.response && error.response.data) {
        const serverMessage =
          error.response.data.message ||
          "Terjadi kesalahan. Silakan coba lagi.";
        if (serverMessage.includes("Invalid email or password")) {
          setErrors((prev) => ({
            ...prev,
            general: "Email atau password salah",
          }));
        } else if (serverMessage.includes("Email not verified")) {
          setErrors((prev) => ({
            ...prev,
            general: "Email belum diverifikasi. Silakan cek email Anda.",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            general: serverMessage,
          }));
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          general: "Terjadi kesalahan. Silakan coba lagi.",
        }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 p-6 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-blue-600 rounded-full" />
        <h1 className="text-2xl text-white font-semibold">Awur-awuran</h1>
      </div>

      <Card className="w-full max-w-6xl">
        <CardContent className="p-8 grid md:grid-cols-2 gap-8">
          <div className="flex items-center justify-center bg-muted rounded-lg p-6">
            <img
              src="/placeholder.svg?height=400&width=400"
              alt="Ilustrasi keamanan"
              className="w-full max-w-md"
            />
          </div>

          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Login</h2>
              <p className="text-muted-foreground">
                Login untuk akses tugas PBO kita gas cihuyyy
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <p className="text-red-500 text-sm">{errors.general}</p>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example123@gmail.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        rememberMe: checked === true,
                      }))
                    }
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Ingat saya
                  </label>
                </div>
                <Button variant="link" className="text-primary p-0 h-auto">
                  Lupa Password
                </Button>
              </div>

              <Button type="submit" className="w-full">
                Login
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Belum punya akun?{" "}
                <Link
                  to="/auth/register"
                  className="text-primary hover:underline"
                >
                  Daftar
                </Link>
              </p>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
