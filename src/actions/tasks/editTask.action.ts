"use server";

import { Action } from "@/core/ports/action.port";
import { getSession } from "@/utils/cookie";
import { redirect } from "next/navigation";
import { verifyJWTAction } from "../verifyJWT.action";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { EditTaskSchema } from "@/schema/projects/editTask.schema";

export const editTaskAction: Action<EditTaskSchema> = async ({
  id,
  title,
  description,
  assignedUserusernames,
  checkListItems,
}) => {
  try {
    const token = await getSession();
    if (!token) redirect("/auth");
    const { userId, error } = await verifyJWTAction(token);
    if (error) redirect("/auth");

    const task = await prisma.task.findFirst({
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
        assignedUsers: true,
        checkList: true,
        message: true,
      },
    });
    if (!task)
      return {
        ok: false,
        message: "Only creator and members of the task can edit the task!",
      };

    const checkListItemsNotExistingAnymore = task.checkList.filter(
      (item) => !checkListItems.find((item2) => item2.id === item.id)
    );
    const checkListItemsNewlyAdded = checkListItems.filter((item) => !item.id);

    const membersNotExistingAnymore = task.assignedUsers.filter(
      (item) =>
        !assignedUserusernames.find((username) => username === item.username)
    );
    const membersNewlyAdded = assignedUserusernames.filter(
      (username) =>
        !task.assignedUsers.find((item) => item.username === username)
    );

    await prisma.$transaction(async (tx) => {
      const taskUpdated = await tx.task.update({
        where: {
          id,
        },
        data: {
          title,
          description,
        },
      });

      //   delete removed checkListItems
      await tx.checkListItem.deleteMany({
        where: {
          id: {
            in: checkListItemsNotExistingAnymore.map((item) => item.id),
          },
        },
      });

      //   create new checkLists
      for (const { content, isDone } of checkListItemsNewlyAdded) {
        await tx.checkListItem.create({
          data: {
            content,
            isDone,
            taskId: task.id,
          },
        });
      }

      for (const username of membersNewlyAdded) {
        await tx.task.update({
          where: {
            id: taskUpdated.id,
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

      for (const { username } of membersNotExistingAnymore) {
        await tx.task.update({
          where: {
            id: taskUpdated.id,
          },
          data: {
            assignedUsers: {
              disconnect: {
                username,
              },
            },
          },
        });
      }
    });

    revalidatePath(
      `/dashboard/my-projects/${task.message.projectRecepientId!}`
    );

    return {
      ok: true,
      message: "Task edited successfully.",
    };
  } catch {
    return {
      ok: false,
      message: "Something went wrong!",
    };
  }
};
