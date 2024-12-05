import { Badge, MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export function NoteCard({
  date,
  title,
  tags,
}: {
  date: string;
  title: string;
  tags: string[];
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{date}</span>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
        <h4 className="font-medium mb-2">{title}</h4>
        <p className="text-sm text-muted-foreground mb-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut id dui mi.
          Fusce varius bibendum ante, non lacinia.
        </p>
        <div className="flex gap-2">
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
