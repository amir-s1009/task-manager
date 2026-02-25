"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Action } from "@/core/ports/action.port";
import { MessageEntity } from "@/entities/messages/messageListItem.entity";
import { changeTaskAcomplishmentSchema } from "@/schema/tasks/changeTaskAcompishment.schema";
import { format } from "date-fns";
import { Clock2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function MessageCard({
  message,
  onPreviewTask,
  isFirst,
  onChangeTaskAcomplishment,
}: {
  message: MessageEntity;
  onPreviewTask?: () => void;
  isFirst: boolean;
  onChangeTaskAcomplishment: Action<changeTaskAcomplishmentSchema>;
}) {
  const [isDone, setIsDone] = useState(message.task?.isAcomplished ?? false);

  const isTask = !!message.task;

  const handleChangeTaskAcomplishment = async () => {
    const optimisticValue = !isDone;

    // optimistic update
    setIsDone(optimisticValue);

    const result = await onChangeTaskAcomplishment({
      id: message.task!.id,
      isAcomplished: optimisticValue,
    });

    if (!result.ok) {
      // rollback
      setIsDone(!optimisticValue);
      toast.error(result.message || "Something went wrong");
    }
  };

  return (
    <div
      onClick={onPreviewTask}
      className={`flex items-start gap-3 p-3 rounded-xl transition
                  ${message.iAmSender ? "border border-green-300" : ""}
                  ${isTask ? "cursor-pointer hover:bg-muted" : ""}
                  ${isFirst && "mt-8"}
                `}
    >
      {/* Avatar */}
      <Avatar>
        <AvatarFallback>{message.sender.full_name[0]}</AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">
            {message.sender.full_name} {message.iAmSender && " • You"}
          </span>

          <span className="text-xs text-muted-foreground">
            {message.sentAt === "-" ? (
              <Clock2 className="size-4" />
            ) : (
              format(new Date(message.sentAt), "HH:mm")
            )}
          </span>
        </div>

        {/* Content */}
        <div className="flex items-start gap-2">
          {isTask && (
            <Checkbox
              className="mt-1"
              checked={isDone}
              onClick={async (e) => {
                e.stopPropagation();
                await handleChangeTaskAcomplishment();
              }}
            />
          )}

          <div className="text-sm space-y-1 w-full">
            {message.content && <p>{message.content}</p>}

            {isTask && (
              <div className="bg-background border rounded-lg p-2 mt-1">
                <p className="font-medium">{message.task?.title}</p>

                {message.task?.description && (
                  <p className="text-xs text-muted-foreground">
                    {message.task.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-1 mt-2">
                  {message.task?.assignedUsers.map((user) => (
                    <Badge
                      key={user.username}
                      variant="secondary"
                      className="text-xs"
                    >
                      {user.full_name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
