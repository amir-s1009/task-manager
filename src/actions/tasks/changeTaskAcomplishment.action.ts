"use server";

import { Action } from "@/core/ports/action.port";
import { changeTaskAcomplishmentSchema } from "@/schema/tasks/changeTaskAcompishment.schema";
import { getSession } from "@/utils/cookie";
import { redirect } from "next/navigation";
import { verifyJWTAction } from "../verifyJWT.action";
import { prisma } from "@/db/prisma";

export const changeTaskAcomplishmentAction: Action<
  changeTaskAcomplishmentSchema
> = async ({ id, isAcomplished }) => {
  try {
    const token = await getSession();
    if (!token) redirect("/auth");
    const { error, userId } = await verifyJWTAction(token);
    if (error) redirect("auth");

    const task = await prisma.task.findUnique({
      where: {
        id,
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
    });

    if (!task)
      return {
        ok: false,
        message:
          "Only creator and members of the task can change acomplishment of it.",
      };

    await prisma.task.update({
      where: {
        id,
      },
      data: {
        isAcomplished,
      },
    });

    return {
      ok: true,
      message: "Task acomplishment changed successfully.",
    };
  } catch {
    return {
      ok: false,
      message: "Something went wrong!",
    };
  }
};
