"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, PlusCircle } from "lucide-react";
import { ProjectEntity } from "@/entities/projects/project.entity";
import { PROJECT_STATUS } from "@prisma/client";
import { cn } from "@/utils/styles";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Action } from "@/core/ports/action.port";
import { CreateMessageSchema } from "@/schema/messages/createMessage.schema";
import { toast } from "sonner";
import { ProfileEntity } from "@/entities/profile/profile.entity";
import MessageCard from "../messages/messageCard";
import { changeTaskAcomplishmentSchema } from "@/schema/tasks/changeTaskAcompishment.schema";

export default function ProjectDetailPage({
  project,
  profile,
  onSendMessage,
  onChangeTaskAcomplishment,
}: {
  project: ProjectEntity;
  profile: ProfileEntity;
  onSendMessage: Action<CreateMessageSchema>;
  onChangeTaskAcomplishment: Action<changeTaskAcomplishmentSchema>;
}) {
  const [projectData, setProjectData] = useState<ProjectEntity>(project);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [projectData.messages]);

  useEffect(() => {
    setProjectData(project);
  }, [project]);

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const message = form.get("message") as string;
    e.currentTarget.reset();

    setProjectData((prev) => ({
      ...prev,
      messages: [
        ...projectData.messages,
        {
          iAmSender: true,
          id: "",
          sender: {
            full_name: profile.full_name,
            username: "",
          },
          sentAt: "-",
          content: message,
          projectRecepientId: projectData.id,
        },
      ],
    }));
    const result = await onSendMessage({
      content: message,
      projectRecepientId: projectData.id,
    });
    if (result.ok) {
      router.refresh();
    } else {
      toast.error(result.message ?? "Message not sent!");
    }
  };

  const statusColor =
    project.status === PROJECT_STATUS.PENDING
      ? "bg-amber-500"
      : project.status === PROJECT_STATUS.IN_PROGRESS
      ? "bg-cyan-500"
      : project.status === PROJECT_STATUS.SUSPENDED
      ? "bg-red-500"
      : project.status === PROJECT_STATUS.FULFILED
      ? "bg-green-500"
      : "";

  return (
    <div className="relative flex flex-col h-full mx-auto gap-2">
      {/* ================= HEADER ================= */}
      <Card
        className="cursor-pointer py-3 hover:shadow-md transition absolute top-0 left-0 right-0 z-50"
        onClick={() =>
          router.push(`/dashboard/my-projects/${project.id}/view-details`)
        }
      >
        <CardHeader className="">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{project.title}</CardTitle>

            <Badge className={cn("text-white", statusColor)}>
              {project.status.replace("_", " ")}
            </Badge>
          </div>

          {project.description && (
            <CardDescription>{project.description}</CardDescription>
          )}
        </CardHeader>
      </Card>

      {/* ================= MESSAGES ================= */}
      <Card
        ref={scrollRef}
        className="flex-1 overflow-y-auto [scrollbar-width:thin]"
      >
        <CardContent className="space-y-4 py-6">
          <div className="w-max text-xs text-muted-foreground flex items-center gap-3 mt-20 mx-auto sticky top-16 rounded-full p-2 bg-neutral-100">
            <span>
              Created {format(new Date(project.createdAt), "MMM dd, yyyy")}
            </span>
            <span>•</span>
            <span>{project.membersCount} Members</span>
          </div>

          {projectData.messages.map((message, index) => {
            return (
              <MessageCard
                key={message.id + `---${index}`}
                isFirst={index === 0}
                message={message}
                onChangeTaskAcomplishment={onChangeTaskAcomplishment}
                onPreviewTask={() => {
                  if (!!message.task) {
                    router.push(
                      `/dashboard/my-projects/${project.id}/editTask/${message.task?.id}`
                    );
                  }
                }}
              />
            );
          })}
          <div ref={bottomRef} />
        </CardContent>
      </Card>

      {/* ================= INPUT BAR ================= */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <Input name="message" placeholder="Type a message..." />

        <Button type="submit" size="icon">
          <Send size={18} />
        </Button>

        <Button
          size="icon"
          variant="secondary"
          type="button"
          onClick={() =>
            router.push(`/dashboard/my-projects/${project.id}/createTask`)
          }
        >
          <PlusCircle size={18} />
        </Button>
      </form>
    </div>
  );
}
