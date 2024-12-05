/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useContext } from "react";
import { Navbar } from "../components/Navbar";
import { Leftbar } from "../components/Leftbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuthContext } from "@/contexts/AuthContext";
import { fetchAllProjects } from "@/services/projectService";
import { useNavigate } from 'react-router-dom';

interface Project {
  id: number;
  name: string;
  description?: string;
  status?: string;
  priority?: string;
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [statusCounts, setStatusCounts] = useState({
    assigned: 0,
    inProgress: 0,
    completed: 0,
  });

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { token } = authContext;

  useEffect(() => {
    const loadProjects = async () => {
      if (!token) {
        console.warn("No auth token available");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const projectData = await fetchAllProjects(token); // Panggil service API
        setProjects(projectData); // Simpan data proyek

        // Hitung jumlah proyek berdasarkan status
        const counts = {
          assigned: projectData.filter((project) => project.status === "Assigned").length,
          inProgress: projectData.filter((project) => project.status === "In Progress").length,
          completed: projectData.filter((project) => project.status === "Completed").length,
        };
        setStatusCounts(counts); // Perbarui status proyek
      } catch (error: any) {
        console.error("Failed to fetch projects:", error);
        setError("Gagal memuat proyek.");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [token]);

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Leftbar */}
      <div className="hidden lg:block fixed top-0 left-0 h-full w-64">
        <Leftbar />
      </div>

      {/* Main Content Area */}
      <div
        className="
          flex flex-col 
          min-h-screen 
          lg:ml-64 
          transition-all 
          duration-300
        "
      >
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="p-6">
          {/* Baru Saja Dibuka Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Baru Saja Dibuka</h2>
              <Button variant="link">Selengkapnya</Button>
            </div>
            {loading ? (
              <p className="text-center mt-4 text-sm">Memuat proyek...</p>
            ) : error ? (
              <p className="text-center mt-4 text-red-500">{error}</p>
            ) : projects.length === 0 ? (
              <p className="text-center mt-4 text-sm">Belom ada project yang di tugasin nich</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>

          {/* Status Seluruh Project Anda Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Status Seluruh Project Anda
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <StatusCard
                count={statusCounts.assigned}
                label="Assigned"
                subLabel="Belum dikerjakan"
                color="bg-blue-100"
              />
              <StatusCard
                count={statusCounts.inProgress}
                label="On Progress"
                subLabel="Sedang dikerjakan"
                color="bg-yellow-100"
              />
              <StatusCard
                count={statusCounts.completed}
                label="Completed"
                subLabel="Selesai"
                color="bg-green-100"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div>
            <CardTitle className="text-base">{project.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {project.description || "Tidak ada deskripsi"}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-lg mb-3" />
        <div className="flex items-center justify-between">
          <p className="text-sm">
            Status: {project.status || "Unknown"}
          </p>
          <Badge>{project.priority || "Normal"}</Badge>
        </div>
        <div className="flex items-center gap-2 mt-2">
        <Button variant="secondary" size="sm" onClick={() => navigate(`/project-detail/${project.id}`)}>
          Detail
        </Button>
        </div>
      </CardContent>
    </Card>
  );
}



function StatusCard({
  count,
  label,
  subLabel,
  color,
}: {
  count: number;
  label: string;
  subLabel: string;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}
          >
            {count}
          </div>
          <div>
            <h3 className="font-semibold">{label}</h3>
            <p className="text-sm text-muted-foreground">{subLabel}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
