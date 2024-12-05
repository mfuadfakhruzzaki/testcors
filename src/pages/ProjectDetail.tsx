import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthContext';
import { fetchProjectById } from '@/services/projectService';
import { Navbar } from '@/components/Navbar';
import { Leftbar } from '@/components/Leftbar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface Note {
  id: number;
  content: string;
  timestamp: string;
  tags: string[];
}

interface ProjectDetail {
  id: number;
  name: string;
  description: string;
  status: string;
  priority: string;
  tasks: Task[];
  notes: Note[];
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { token } = authContext;

  useEffect(() => {
    const loadProject = async () => {
      if (!token || !id) return;

      setLoading(true);
      setError(null);

      try {
        const data = await fetchProjectById(token, Number(id));
        setProject(data);
      } catch (error) {
        setError('Failed to load project details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [token, id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden lg:block fixed top-0 left-0 h-full w-64">
        <Leftbar />
      </div>

      <div className="flex flex-col min-h-screen lg:ml-64 transition-all duration-300">
        <Navbar />

        <main className="flex-1">
          {/* Header Section */}
          <div className="h-48 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-6 flex flex-col justify-end">
            <div className="text-white space-y-2">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{project.name}</h1>
                <Badge variant="secondary">{project.priority}</Badge>
              </div>
              <p>Status: {project.status}</p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {project.description || "No description provided"}
                </p>
              </CardContent>
            </Card>

            {/* Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {project.tasks?.map((task) => (
                    <div key={task.id} className="flex items-center space-x-2">
                      <Checkbox id={`task-${task.id}`} checked={task.completed} />
                      <label
                        htmlFor={`task-${task.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {task.title}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.notes?.map((note) => (
                    <div key={note.id} className="space-y-2">
                      <p className="text-sm">{note.content}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(note.timestamp).toLocaleDateString()}
                        </span>
                        <div className="flex gap-1">
                          {note.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

