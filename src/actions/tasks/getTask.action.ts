import { Action } from "@/core/ports/action.port";
import { TaskEntity } from "@/entities/tasks/task.entity";
import { GetTaskSchema } from "@/schema/tasks/getTask.schema";
import { getSession } from "@/utils/cookie";
import { redirect } from "next/navigation";
import { verifyJWTAction } from "../verifyJWT.action";
import { prisma } from "@/db/prisma";

export const getTaskAction: Action<GetTaskSchema, TaskEntity> = async ({
  id,
}) => {
  try {
    const token = await getSession();
    if (!token) redirect("/auth");
    const { userId, error } = await verifyJWTAction(token);
    if (error) redirect("/auth");

    const task = await prisma.task.findUnique({
      where: {
        id,
        message: {
          projectRecepient: {
            OR: [
              {
                creatorId: userId!,
              },
              {
                members: {
                  some: {
                    id: userId!,
                  },
                },
              },
            ],
          },
        },
      },
      include: {
        assignedUsers: {
          select: {
            id: true,
            full_name: true,
            username: true,
          },
        },
        checkList: {
          select: {
            id: true,
            content: true,
            isDone: true,
          },
        },
      },
    });

    if (!task)
      return {
        ok: false,
        message: "No such Task found!",
      };

    return {
      ok: true,
      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        isAcomplished: task.isAcomplished,
        progressIndex: task.progressIndex,
        assignedUsers: task.assignedUsers.map((user) => ({
          full_name: user.full_name,
          username: user.username,
        })),
        checkListItems: task.checkList,
        iAmCreator: task.creatorId === userId!,
        iAmMember: !!task.assignedUsers.find((user) => user.id === userId!),
      },
    };
  } catch {
    return {
      ok: false,
      message: "Something went wrong!",
    };
  }
};
