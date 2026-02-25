"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TaskListItemEntity } from "@/entities/tasks/taskListItem.entity";
import { Action } from "@/core/ports/action.port";
import { changeTaskAcomplishmentSchema } from "@/schema/tasks/changeTaskAcompishment.schema";
import TaskListItem from "./taskListItem";

export default function TasksListViewPage({
  tasks,
  onChangeAcomplishment,
}: {
  tasks: TaskListItemEntity[];
  onChangeAcomplishment: Action<changeTaskAcomplishmentSchema>;
}) {
  const router = useRouter();

  return (
    <div className="mx-auto py-0 space-y-6">
      {/* ================= HEADER ================= */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">My Tasks</h1>
        <p className="text-sm text-muted-foreground">
          Track what’s assigned to you and what you’ve created. Stay sharp. Ship
          things.
        </p>
      </div>

      {/* ================= LIST ================= */}
      <div className="space-y-4">
        {tasks.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-12">
            No tasks yet. Time to create something productive 👀
          </div>
        )}

        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
            }}
          >
            <TaskListItem
              taskItem={task}
              onPreview={() =>
                router.push(
                  `/dashboard/my-tasks/${task.id}?projectId=${task.project.id}`
                )
              }
              onChangeAcomplishment={onChangeAcomplishment}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
