'use server';

import { Action } from "@/core/ports/action.port";
import { ChangeProjectStatusSchema } from "@/schema/projects/changeProjectStatus.schema";
import { getSession } from "@/utils/cookie";
import { redirect } from "next/navigation";
import { verifyJWTAction } from "../verifyJWT.action";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";

export const changeProjectStatusAction: Action<ChangeProjectStatusSchema> = async ({
  id,
  status,
}) => {
  try {
    const token = await getSession();
    if (!token) redirect("/auth");

    const { userId, error } = await verifyJWTAction(token);
    if (error) redirect("/auth");

    await prisma.project.update({
      where: {
        id,
        creatorId: userId,
      },
      data: {
        status,
      },
    });

    revalidatePath(`/dashboard/my-projects/${id}`);

    return {
      ok: true,
      message: "Project status changed successfully!",
    };
  } catch {
    return {
      ok: false,
      message: "Something went wrong!",
    };
  }
};
