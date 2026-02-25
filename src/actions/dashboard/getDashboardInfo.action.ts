import { Action } from "@/core/ports/action.port";
import { DashboardEntity } from "@/entities/dashboard/dashboard.entity";
import { PROJECT_STATUS } from "@prisma/client";
import { verifyJWTAction } from "../verifyJWT.action";
import { getSession } from "@/utils/cookie";
import { redirect } from "next/navigation";
import { prisma } from "@/db/prisma";

export const getDashboardInfoAction: Action<
  undefined,
  DashboardEntity
> = async () => {
  try {
    const token = await getSession();
    if (!token) redirect("/auth");

    const { userId, error } = await verifyJWTAction(token);
    if (error || !userId) redirect("/auth");

    /* ================= PROJECTS ================= */

    const projects = await prisma.project.findMany({
      where: {
        isDeleted: false,
        OR: [{ creatorId: userId }, { members: { some: { id: userId } } }],
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
      },
    });

    const totalProjects = projects.length;

    const activeProjects = projects.filter(
      (p) => p.status === PROJECT_STATUS.IN_PROGRESS
    ).length;

    const recentProjects = projects.slice(0, 5);

    /* ================= TASKS ================= */

    const tasks = await prisma.task.findMany({
      where: {
        assignedUsers: {
          some: { id: userId },
        },
      },
      orderBy: { id: "desc" },
      select: {
        id: true,
        title: true,
        isAcomplished: true,
      },
    });

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter((t) => t.isAcomplished).length;

    const recentTasks = tasks.slice(0, 5);

    /* ================= RETURN ================= */

    return {
      ok: true,
      data: {
        stats: {
          totalProjects,
          activeProjects,
          totalTasks,
          completedTasks,
        },
        recentProjects,
        recentTasks,
      },
    };
  } catch {
    return {
      ok: false,
      message: "Something went wrong!",
    };
  }
};
