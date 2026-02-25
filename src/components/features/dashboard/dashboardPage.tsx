"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, FolderKanban, ListTodo } from "lucide-react";
import { PROJECT_STATUS } from "@prisma/client";
import { DashboardEntity } from "@/entities/dashboard/dashboard.entity";
import { cn } from "@/utils/styles";

export default function DashboardPage({
  dashboard,
}: {
  dashboard: DashboardEntity;
}) {
  const router = useRouter();

  const completionRate =
    dashboard.stats.totalTasks === 0
      ? 0
      : Math.round(
          (dashboard.stats.completedTasks / dashboard.stats.totalTasks) * 100
        );

  const getStatusColor = (status: PROJECT_STATUS) => {
    return status === PROJECT_STATUS.PENDING
      ? "bg-amber-500"
      : status === PROJECT_STATUS.IN_PROGRESS
      ? "bg-cyan-500"
      : status === PROJECT_STATUS.SUSPENDED
      ? "bg-red-500"
      : status === PROJECT_STATUS.FULFILED
      ? "bg-green-500"
      : "";
  };

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-10">
      {/* ================= HEADER ================= */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Quick overview of your productivity and active workspaces.
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Projects"
          value={dashboard.stats.totalProjects}
          icon={<FolderKanban size={18} />}
        />

        <StatCard
          title="Active Projects"
          value={dashboard.stats.activeProjects}
          icon={<FolderKanban size={18} />}
        />

        <StatCard
          title="Total Tasks"
          value={dashboard.stats.totalTasks}
          icon={<ListTodo size={18} />}
        />

        <StatCard
          title="Completed Tasks"
          value={`${completionRate}%`}
          icon={<CheckCircle2 size={18} />}
        />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {dashboard.recentProjects.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No recent projects.
              </p>
            )}

            {dashboard.recentProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() =>
                  router.push(`/dashboard/my-projects/${project.id}`)
                }
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer transition"
              >
                <span className="text-sm font-medium">{project.title}</span>

                <Badge
                  className={cn(
                    "text-white text-xs",
                    getStatusColor(project.status)
                  )}
                >
                  {project.status.replace("_", " ")}
                </Badge>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {dashboard.recentTasks.length === 0 && (
              <p className="text-sm text-muted-foreground">No recent tasks.</p>
            )}

            {dashboard.recentTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => router.push(`/dashboard/my-tasks/${task.id}`)}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer transition"
              >
                <span
                  className={cn(
                    "text-sm",
                    task.isAcomplished && "line-through text-muted-foreground"
                  )}
                >
                  {task.title}
                </span>

                {task.isAcomplished && (
                  <CheckCircle2 size={16} className="text-green-500" />
                )}
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="hover:shadow-md transition">
      <CardContent className="p-6 flex flex-col gap-3">
        <div className="flex items-center justify-between text-muted-foreground text-sm">
          <span>{title}</span>
          {icon}
        </div>

        <div className="text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}
