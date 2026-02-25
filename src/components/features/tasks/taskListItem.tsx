"use client";

import { useState, useTransition } from "react";
import { TaskListItemEntity } from "@/entities/tasks/taskListItem.entity";
import { Action } from "@/core/ports/action.port";
import { changeTaskAcomplishmentSchema } from "@/schema/tasks/changeTaskAcompishment.schema";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/styles";
import { CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";

export default function TaskListItem({
  taskItem,
  onPreview,
  onChangeAcomplishment,
}: {
  taskItem: TaskListItemEntity;
  onPreview: () => void;
  onChangeAcomplishment: Action<changeTaskAcomplishmentSchema>;
}) {
  const [isDone, setIsDone] = useState(taskItem.isAcomplished);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const optimisticValue = !isDone;

    // optimistic update
    setIsDone(optimisticValue);

    startTransition(async () => {
      const result = await onChangeAcomplishment({
        id: taskItem.id,
        isAcomplished: optimisticValue,
      });

      if (!result.ok) {
        // rollback
        setIsDone(!optimisticValue);
        toast.error(result.message || "Something went wrong");
      }
    });
  };

  return (
    <Card
      onClick={onPreview}
      className={cn(
        "p-4 flex items-start gap-4 cursor-pointer transition-all hover:shadow-md",
        isDone && "opacity-60"
      )}
    >
      {/* Checkbox */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          handleToggle();
        }}
        className="mt-1"
      >
        <Checkbox checked={isDone} disabled={isPending} />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <h3
            className={cn(
              "font-medium text-sm",
              isDone && "line-through text-muted-foreground"
            )}
          >
            {taskItem.title}
          </h3>

          <Badge variant="secondary" className="text-[10px]">
            {taskItem.project.title}
          </Badge>
        </div>

        {taskItem.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {taskItem.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs">
          {/* Assigned Users */}
          <div className="flex items-center gap-2">
            {taskItem.assignedUsers.slice(0, 3).map((user, index) => (
              <div
                key={index}
                className="px-2 py-0.5 rounded-full bg-muted text-[10px]"
              >
                @{user.username}
              </div>
            ))}
            {taskItem.assignedUsers.length > 3 && (
              <div className="text-[10px] text-muted-foreground">
                +{taskItem.assignedUsers.length - 3}
              </div>
            )}
          </div>

          {/* Ownership */}
          <div className="flex items-center gap-1 text-muted-foreground">
            {taskItem.isAssignedToOthers ? (
              <>
                <CheckCircle2 size={12} />
                <span>Created by you</span>
              </>
            ) : (
              <>
              <Circle size={12} />
              <span>Assigned to you</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
