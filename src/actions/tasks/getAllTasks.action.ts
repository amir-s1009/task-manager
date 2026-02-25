import { Action } from "@/core/ports/action.port";
import { TaskListItemEntity } from "@/entities/tasks/taskListItem.entity";
import { getSession } from "@/utils/cookie";
import { redirect } from "next/navigation";
import { verifyJWTAction } from "../verifyJWT.action";
import { prisma } from "@/db/prisma";

export const getAllTasksAction: Action<
  undefined,
  TaskListItemEntity[]
> = async () => {
  try {
    const token = await getSession();
    if (!token) redirect("/auth");
    const { error, userId } = await verifyJWTAction(token);
    if (error) redirect("/auth");

    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          {
            creatorId: userId!,
          },
          {
            assignedUsers: {
              some: {
                id: userId!,
              },
            },
          },
        ],
      },
      include: {
        message: {
          include: {
            projectRecepient: true,
          },
        },
        assignedUsers: {
          select: {
            full_name: true,
            username: true,
          },
        },
      },
    });

    return {
      ok: true,
      data: tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        project: {
          id: task.message.projectRecepientId as string,
          title: task.message.projectRecepient?.title || "",
        },
        assignedUsers: task.assignedUsers,
        isAssignedToOthers: task.creatorId === userId!,
        isAcomplished: task.isAcomplished,
      })),
    };
  } catch {
    return {
      ok: false,
      message: "Something went wrong!",
    };
  }
};
