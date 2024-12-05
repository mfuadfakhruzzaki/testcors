import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Leftbar } from "../components/Leftbar";
import { Rightbar } from "../components/Rightbar";

interface Task {
  title: string;
  progress: number;
  priority: "High" | "Medium" | "Low";
  subtasks: string[];
  assignees: string[];
}

interface TaskGroupProps {
  title: string;
  description: string;
  tasks: Task[];
  colorClass: string;
}

export default function Component() {
  const tasks: Task[] = [
    {
      title: "Tugas Akhir Praktikum PPB",
      progress: 0,
      priority: "High",
      subtasks: [
        "Cari Judul Tugas Akhir",
        "Tentuin Tech Stack",
        "Cari API Project Tugas Akhir",
        "List Spreadsheet Tugas Akhir",
        "Kerjakan",
      ],
      assignees: ["mustafa", "mustafa", "mustafa", "mustafa"],
    },
    // More tasks can be added here
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:block fixed top-0 left-0 h-full w-64">
        <Leftbar />
      </div>
      <div
        className="flex-1 flex flex-col  
          min-h-screen 
          lg:ml-64
          lg:mr-80 
          transition-all 
          duration-300"
      >
        <Navbar />
        <main className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-sm inline-block" />
                High - Website Tugas Besar PBO
              </h1>
            </div>
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Plus className="mr-2 h-4 w-4" />
              Create Projects/Tasks
            </Button>
          </div>

          <div className="space-y-8">
            <TaskGroup
              title="Assigned"
              description="Belum dikerjakan"
              tasks={tasks}
              colorClass="bg-red-500"
            />

            <TaskGroup
              title="On Progress"
              description="Sedang dikerjakan"
              tasks={tasks}
              colorClass="bg-yellow-500"
            />

            <TaskGroup
              title="Completed"
              description="Selesai"
              tasks={tasks}
              colorClass="bg-green-500"
            />
          </div>
        </main>
      </div>
      <div className="hidden xl:block fixed right-0 top-0">
        <Rightbar />
      </div>
    </div>
  );
}

function TaskGroup({ title, description, tasks, colorClass }: TaskGroupProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className={`w-4 h-4 ${colorClass} rounded-sm`} />
        <h2 className="text-xl font-semibold">{title}</h2>
        <span className="text-muted-foreground">- {description}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {tasks.map((task, index) => (
          <TaskCard key={index} task={task} />
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{task.title}</CardTitle>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              {task.progress}%
            </div>
            <Badge
              variant="secondary"
              className={
                task.priority === "High"
                  ? "bg-red-100 text-red-800"
                  : task.priority === "Medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }
            >
              {task.priority}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {task.subtasks.map((subtask, index) => (
            <div key={index} className="flex items-start space-x-2">
              <Checkbox id={`task-${index}`} />
              <label
                htmlFor={`task-${index}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {subtask}
              </label>
            </div>
          ))}

          <div className="flex -space-x-2 pt-4">
            {task.assignees.map((assignee, index) => (
              <Avatar key={index} className="border-2 border-background">
                <AvatarFallback className="bg-muted">
                  {assignee[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
