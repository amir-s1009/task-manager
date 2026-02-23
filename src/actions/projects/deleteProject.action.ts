'use server';

import { Action } from "@/core/ports/action.port";
import { DeleteProjectSchema } from "@/schema/projects/deleteProject.schema";
import { getSession } from "@/utils/cookie";
import { verifyJWTAction } from "../verifyJWT.action";
import { prisma } from "@/db/prisma";
import { redirect } from "next/navigation";

export const deleteProjectAction: Action<DeleteProjectSchema> = async ({
  id,
}) => {
  try {
    const token = await getSession();
    if (!token) redirect("/auth");
    const { userId, error } = await verifyJWTAction(token);
    if (error) redirect("/auth");

    await prisma.project.update({
      where: {
        id,
        creatorId: userId!,
      },
      data: {
        isDeleted: true,
      },
    });

    return {
      ok: true,
      message: "Your project deleted successfully!",
    };
  } catch {
    return {
      ok: false,
      message: "Something went wrong!",
    };
  }
};
