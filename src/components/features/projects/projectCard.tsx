"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FolderKanban, CalendarDays, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ProjectListItemEntity } from "@/entities/projects/projectListItem.entity";
import { PROJECT_STATUS } from "@prisma/client";
import { cn } from "@/utils/styles";
import { useState } from "react";
import { ChangeProjectStatusSchema } from "@/schema/projects/changeProjectStatus.schema";
import { Action } from "@/core/ports/action.port";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DeleteProjectSchema } from "@/schema/projects/deleteProject.schema";

export default function ProjectCard({
  project,
  onChangeProjectStatus,
  onDeleteProject,
}: {
  project: ProjectListItemEntity;
  onChangeProjectStatus: Action<ChangeProjectStatusSchema>;
  onDeleteProject: Action<DeleteProjectSchema>;
}) {
  const [status, setStatus] = useState(project.status);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (newStatus: PROJECT_STATUS) => {
    setStatus(newStatus);
    setIsOpen(false);
    const result = await onChangeProjectStatus({
      id: project.id,
      status: newStatus,
    });
    if (result.ok) {
      toast.success(result.message ?? "");
      router.refresh();
    } else {
      toast.error(result.message ?? "");
    }
  };

  const handleDeleteProject = async () => {
    const result = await onDeleteProject({id:project.id});
    if (result.ok) {
      toast.success(result.message ?? "");
      router.refresh();
    } else {
      toast.error(result.message ?? "");
    }
  }

  const statusColor = cn(
    "absolute left-4 -top-2 text-white text-xs",
    status === PROJECT_STATUS.PENDING
      ? "bg-amber-500"
      : status === PROJECT_STATUS.IN_PROGRESS
      ? "bg-cyan-500"
      : status === PROJECT_STATUS.SUSPENDED
      ? "bg-red-500"
      : status === PROJECT_STATUS.FULFILED
      ? "bg-green-500"
      : ""
  );

  return (
    <DropdownMenu open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <DropdownMenuTrigger onContextMenu={(e) => {
        e.preventDefault();
        setIsOpen(true)
      }} onClick={() => router.push(`/dashboard/my-projects/${project.id}`)} asChild>
        <Card className="relative h-full transition-shadow hover:shadow-xl cursor-pointer">
          <Badge className={statusColor}>{status.toLowerCase()}</Badge>

          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base line-clamp-2">
                <FolderKanban size={18} />
                {project.title}
              </CardTitle>

              <Badge variant="secondary">{project.tasksCount} Tasks</Badge>
            </div>

            <CardDescription className="line-clamp-1">
              {project.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarDays size={14} />
              {format(new Date(project.createdAt), "MMM dd, yyyy")}
            </div>

            <div>{project.membersCount} Members</div>
          </CardContent>
        </Card>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem
          key={"detele button"}
          onClick={handleDeleteProject}
          className={cn(
            "cursor-pointer text-red-500 bg-white rounded-none border-b border-neutral-400 mb-2 hover:bg-red-100",
          )}
        >
          <Trash2 className="text-red-500" /> Delete
        </DropdownMenuItem>
        {Object.values(PROJECT_STATUS).map((s) => (
          <DropdownMenuItem
            key={s}
            onClick={() => handleStatusChange(s)}
            className={cn(
              "cursor-pointer",
              s === status && "bg-muted font-semibold"
            )}
          >
            {s.replace("_", " ")}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
