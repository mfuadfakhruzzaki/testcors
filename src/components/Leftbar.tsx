/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef, useContext } from "react";
import axios, { AxiosError } from "axios";
import {
  Home,
  Activity,
  LayoutGrid,
  Plus,
  Settings2,
  LogOut,
  Edit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";

// Import Dialog components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Import DatePicker component
import { DatePicker } from "@/components/ui/DatePicker";

interface Project {
  id: number;
  name: string;
  count: number;
  icon: "yellow" | "dark" | "gold";
}

interface UserData {
  username: string;
  email: string;
  // Add other properties if needed
}

export function Leftbar() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

  // State for project creation form
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  // Task details
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [taskDeadline, setTaskDeadline] = useState<Date | null>(null);
  const [taskAssignedTo, setTaskAssignedTo] = useState("");

  const [file, setFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { logout, token } = authContext;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "https://api.zacht.tech/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData(null);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token]);

  const fetchProjects = async () => {
    if (!token) {
      console.warn("No auth token available");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://api.zacht.tech/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Projects API response:", response.data);

      const projectData = response.data.data || response.data.projects || [];

      if (!Array.isArray(projectData)) {
        throw new Error("Project data structure is not as expected.");
      }

      const fetchedProjects: Project[] = projectData.map((project: any) => ({
        id: project.id,
        name: project.name,
        count: 0,
        icon: assignIconColor(project.id),
      }));

      setProjects(fetchedProjects);
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          setError(`Error ${axiosError.response.status}`);
        } else if (axiosError.request) {
          setError(
            "No response from server. Please check your network connection."
          );
        } else {
          setError(`Error: ${axiosError.message}`);
        }
      } else {
        setError("Failed to load projects.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    const intervalId = setInterval(fetchProjects, 30000);
    return () => {
      clearInterval(intervalId);
    };
  }, [token]);

  const assignIconColor = (projectId: number): "yellow" | "dark" | "gold" => {
    const colors: Array<"yellow" | "dark" | "gold"> = [
      "yellow",
      "dark",
      "gold",
    ];
    return colors[projectId % colors.length];
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    };

    if (isSettingsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSettingsOpen]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://api.zacht.tech/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await logout();
      navigate("/auth/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const navItems = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Activity", icon: Activity, path: "/activities" },
    { label: "Projects", icon: LayoutGrid, path: "/projects" },
  ];

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectName) {
      alert("Please fill out the project name.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Create Project
      const projectResponse = await axios.post(
        "https://api.zacht.tech/projects",
        {
          name: projectName,
          description: projectDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const projectId = projectResponse.data.data?.id;

      // Step 2: Optionally Create Task if taskTitle is provided
      if (projectId && taskTitle) {
        const taskData: any = {
          title: taskTitle,
          description: taskDescription,
          priority: taskPriority.toLowerCase(),
          status: taskStatus.toLowerCase().replace(" ", "_"),
          assigned_to: taskAssignedTo ? parseInt(taskAssignedTo) : undefined,
          deadline: taskDeadline ? taskDeadline.toISOString() : undefined,
        };

        // Remove undefined fields
        Object.keys(taskData).forEach(
          (key) => taskData[key] === undefined && delete taskData[key]
        );

        await axios.post(
          `https://api.zacht.tech/projects/${projectId}/tasks`,
          taskData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      // Step 3: Optionally Upload File
      if (projectId && file) {
        const formData = new FormData();
        formData.append("file", file);

        await axios.post(
          `https://api.zacht.tech/projects/${projectId}/files`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      console.log("Project created successfully");

      // Close the modal and reset form fields
      setIsModalOpen(false);
      setProjectName("");
      setProjectDescription("");
      setTaskTitle("");
      setTaskDescription("");
      setTaskPriority("");
      setTaskStatus("");
      setTaskDeadline(null);
      setTaskAssignedTo("");
      setFile(null);

      // Refresh projects list
      fetchProjects();
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed flex h-screen w-64 flex-col border-r bg-background">
        {/* Logo */}
        <div className="flex items-center gap-2 p-4">
          <div className="h-8 w-8 rounded-full bg-blue-600" />
          <span className="font-semibold">Awur-awuran</span>
        </div>

        {/* Main Navigation */}
        <nav className="flex-none p-2">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === "/"
                  ? currentPath === item.path
                  : currentPath.startsWith(item.path);

              return (
                <Button
                  key={item.label}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    isActive ? "bg-accent" : ""
                  )}
                  onClick={() => navigate(item.path)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </nav>

        <Separator className="my-2" />

        {/* Projects Section */}
        <div className="flex-1 px-4">
          <div className="flex items-center justify-between py-2">
            <h2 className="text-xs font-semibold text-muted-foreground">
              PROJECTS
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={() => setIsModalOpen(true)}
              aria-label="Add Project"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-1">
              {isLoading && (
                <p className="text-sm text-center text-muted-foreground">
                  Loading projects...
                </p>
              )}
              {error && (
                <div className="text-sm text-center text-red-500">
                  <p>{error}</p>
                </div>
              )}
              {!isLoading && !error && projects.length === 0 && (
                <p className="text-sm text-center text-muted-foreground">
                  No projects.
                </p>
              )}
              {!isLoading &&
                !error &&
                projects.map((project) => (
                  <ProjectItem key={project.id} project={project} />
                ))}
            </div>
          </ScrollArea>
        </div>

        {/* User Profile */}
        <div className="flex-none p-4" ref={settingsRef}>
          <Separator className="mb-4" />
          <div className="relative flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>
                {userData?.username ? userData.username[0].toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <h3 className="truncate text-sm font-medium">
                {userData?.username || "Loading..."}
              </h3>
              <p className="truncate text-xs text-muted-foreground">
                {userData?.email || "Loading..."}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsSettingsOpen((prev) => !prev)}
              aria-label="Settings"
            >
              <Settings2 className="h-4 w-4" />
            </Button>

            {/* Dropdown Menu */}
            {isSettingsOpen && (
              <div className="absolute bottom-12 right-0 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => navigate("/edit-profile")}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Creating New Project */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Fill out the form below to create a new project.
              </DialogDescription>
            </DialogHeader>
            {/* Project Creation Form */}
            <form onSubmit={handleCreateProject}>
              {/* Section 1: Project Name and Description */}
              <div className="mb-6">
                <h3 className="text-md font-medium mb-2">Project Details</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input
                      id="projectName"
                      placeholder="Project Name"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectDescription">
                      Project Description
                    </Label>
                    <Textarea
                      id="projectDescription"
                      placeholder="Project Description"
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Task Details (Optional) */}
              <div className="mb-6">
                <h3 className="text-md font-medium mb-2">
                  Task Details (Optional)
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="taskTitle">Task Title</Label>
                    <Input
                      id="taskTitle"
                      placeholder="Task Title"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="taskDescription">Task Description</Label>
                    <Textarea
                      id="taskDescription"
                      placeholder="Task Description"
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="taskPriority">Priority</Label>
                    <select
                      id="taskPriority"
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value)}
                      className="block w-full px-3 py-2 border rounded-md"
                    >
                      <option value="" disabled>
                        Select Priority
                      </option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="taskStatus">Status</Label>
                    <select
                      id="taskStatus"
                      value={taskStatus}
                      onChange={(e) => setTaskStatus(e.target.value)}
                      className="block w-full px-3 py-2 border rounded-md"
                    >
                      <option value="" disabled>
                        Select Status
                      </option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="taskDeadline">Deadline</Label>
                    <DatePicker
                      selectedDate={taskDeadline}
                      onChange={setTaskDeadline}
                    />
                  </div>
                  <div>
                    <Label htmlFor="taskAssignedTo">
                      Assigned To (User ID)
                    </Label>
                    <Input
                      id="taskAssignedTo"
                      placeholder="Assigned To (User ID)"
                      value={taskAssignedTo}
                      onChange={(e) => setTaskAssignedTo(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: File Upload (Optional) */}
              <div className="mb-6">
                <h3 className="text-md font-medium mb-2">
                  Upload File (Optional)
                </h3>
                <div>
                  <Label htmlFor="fileUpload">File</Label>
                  <Input
                    id="fileUpload"
                    type="file"
                    onChange={(e) => {
                      if (e.target.files) {
                        setFile(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <DialogFooter>
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Project"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

function ProjectItem({ project }: { project: Project }) {
  const navigate = useNavigate();

  const iconColors = {
    yellow: "bg-yellow-500 text-white",
    dark: "bg-gray-900 text-white",
    gold: "bg-yellow-500 text-white",
  };

  return (
    <button
      className="flex w-full items-center gap-2 rounded-lg p-2 text-sm hover:bg-accent"
      onClick={() => navigate(`/project-detail/${project.id}`)}
    >
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full",
          iconColors[project.icon]
        )}
      >
        {project.name[0].toUpperCase()}
      </div>
      <span className="flex-1 truncate text-left font-medium">
        {project.name}
      </span>
      <Badge variant="secondary">{project.count}</Badge>
    </button>
  );
}
