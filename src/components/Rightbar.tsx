import { FileText, Plus, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { NoteCard } from "./Notecard";

export function Rightbar() {
  return (
    <div className="w-80 flex-col border-l">
      <div className="p-4 space-y-6">
        {/* Start Collaborations Section */}
        <div className="space-y-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Users2 className="w-4 h-4" />
            Start Collaborations
          </h3>
          <p className="text-sm text-muted-foreground">
            Ajak teman berkolaborasi dalam tim
          </p>
        </div>

        {/* Join Collaborations Section */}
        <div className="space-y-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Users2 className="w-4 h-4" />
            Join Collaborations
          </h3>
          <p className="text-sm text-muted-foreground">
            Ikuti tim yang telah dibuat sebelumnya
          </p>
        </div>
        <Separator />

        {/* Notes Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Notes
            </h3>
            <Button variant="ghost" size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              <NoteCard
                date="Apr 2, 2023"
                title="ChatGPT Tricks for business marketing"
                tags={["Tech", "AI"]}
              />
              <NoteCard
                date="Apr 3, 2023"
                title="Notes on being a successful entrepreneur"
                tags={["Learning", "Self-Improvement"]}
              />
              <NoteCard
                date="Apr 4, 2023"
                title="What are my life Goals and what I'm currently doing to achieve them"
                tags={["Profitable", "Person", "AI"]}
              />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
