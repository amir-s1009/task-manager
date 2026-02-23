"use server";

import { Action } from "@/core/ports/action.port";
import { CreateTaskSchema } from "@/schema/projects/createTask.schema";
import { getSession } from "@/utils/cookie";
import { redirect } from "next/navigation";
import { verifyJWTAction } from "../verifyJWT.action";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";

export const createTaskAction: Action<CreateTaskSchema> = async ({
  title,
  description,
  projectId,
  assignedUserusernames,
  checkListItems,
}) => {
  try {
    const token = await getSession();
    if (!token) redirect("/auth");
    const { userId, error } = await verifyJWTAction(token);
    if (error) redirect("/auth");

    const project = await prisma.project.findFirst({
      select: {
        id: true,
      },
      where: {
        OR: [
          {
            creatorId: userId,
          },
          {
            members: {
              some: {
                id: userId,
              },
            },
          },
        ],
      },
    });

    if (!project)
      return {
        ok: false,
        message: "Only creator and members of the project can create task!",
      };

    await prisma.$transaction(async (tx) => {
      const messageCreated = await tx.message.create({
        data: {
          senderId: userId!,
          projectRecepientId: projectId,
        },
      });

      const taskCreated = await tx.task.create({
        data: {
          creatorId: userId!,
          messageId: messageCreated.id,
          title,
          description,
          progressIndex: 0,
        },
      });

      for (const { content, isDone } of checkListItems) {
        await tx.checkListItem.create({
          data: {
            content,
            isDone,
            taskId: taskCreated.id,
          },
        });
      }

      for (const username of assignedUserusernames) {
        await tx.task.update({
          where: {
            id: taskCreated.id,
          },
          data: {
            assignedUsers: {
              connect: {
                username,
              },
            },
          },
        });
      }
    });

    revalidatePath(`/dashboard/my-projects/${projectId}`)

    return {
      ok: true,
      message: "Task created successfully.",
    };
  } catch {
    return {
      ok: false,
      message: "Something went wrong!",
    };
  }
};
