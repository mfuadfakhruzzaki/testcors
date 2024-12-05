import { MoreHorizontal, ArrowUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Navbar } from "../components/Navbar";
import { Leftbar } from "../components/Leftbar";
// import { Rightbar } from "../components/Rightbar";

// interface Notification {
//   avatar: string;
//   name: string;
//   date: string;
//   content: string;
//   tags: string[];
// }

export default function Component() {
  // const notifications: Notification[] = [
  //   {
  //     avatar: "OD",
  //     name: "Oren Opsim Dipsum Amed",
  //     date: "Apr 2, 2023",
  //     content:
  //       'Project "Cloth" Has Been Updated! New update has been deployed! - You can check it out at cloth project All!',
  //     tags: ["Tech", "AI"],
  //   },
  //   {
  //     avatar: "RW",
  //     name: "Raditya Wisnu Cahyo Nugroho",
  //     date: "Apr 2, 2023",
  //     content:
  //       "Raditya's Task Has Been Completed on \"Website Development\" Project! Hey guys, I've done my work for this project. You can check it out rn!",
  //     tags: ["Tech", "AI"],
  //   },
  //   {
  //     avatar: "NF",
  //     name: "Najla Fairuz",
  //     date: "Apr 2, 2023",
  //     content:
  //       'Najla Added a Notes to "cloth" project! Hey, I added a notes to this project. Please pay attention!',
  //     tags: ["Tech", "AI"],
  //   },
  // ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Sidebar */}
      <div className="hidden lg:block fixed top-0 left-0 h-full w-64">
        <Leftbar />
      </div>

      {/* Main Content */}
      <div
        className="flex flex-col 
          min-h-screen 
          lg:ml-64 
          transition-all 
          duration-300"
      >
        <Navbar />
        <main className="p-6">
          {/* Header */}
          <header className="border-b p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-sm" />
              <h1 className="text-xl font-semibold">Cloth</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Projects</span>
              <span>→</span>
              <span>Team projects</span>
              <span>→</span>
              <span>Website Development</span>
            </div>
          </header>

          {/* Main Content */}
          <div className="p-4 space-y-6">
            {/* Task Update */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>RW</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h2 className="font-semibold">
                      Raditya Wisnu Cahyo Nugroho
                    </h2>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>15:07</span>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Project "Cloth" Has Been Updated! New update has been
                    deployed!
                  </p>

                  <Card className="mt-4">
                    <CardHeader className="flex-row justify-between items-start space-y-0">
                      <div>
                        <h3 className="font-semibold">Front End Development</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            0%
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-red-100 text-red-800"
                          >
                            High
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Checkbox id="erd" />
                          <label htmlFor="erd" className="text-sm">
                            ERD Diagram
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="ui" />
                          <label htmlFor="ui" className="text-sm">
                            UI / UX Design
                          </label>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {["Oren", "Najla", "Ali", "Firman"].map((name) => (
                          <Avatar
                            key={name}
                            className="border-2 border-background"
                          >
                            <AvatarFallback>{name[0]}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="mt-4 space-y-4">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>OD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold">
                              Oren Opsim Dipsum Amed
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Okay Bos
                            </p>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            16:00
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>FG</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold">
                              Firman Gani Heriansyah
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Consider it done
                            </p>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            16:00
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reply Section */}
            <div className="flex gap-3">
              <Avatar>
                <AvatarFallback>MA</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Input placeholder="Type a reply......" />
                <Button size="icon">
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Right Sidebar - Notifications
      <Rightbar notifications={notifications} /> */}
    </div>
  );
}
