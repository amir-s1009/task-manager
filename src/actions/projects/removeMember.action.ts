'use server';

import { Action } from "@/core/ports/action.port";
import { getSession } from "@/utils/cookie";
import { redirect } from "next/navigation";
import { verifyJWTAction } from "../verifyJWT.action";
import { prisma } from "@/db/prisma";
import { RemoveMemberSchema } from "@/schema/projects/removeMember.schema";
import { revalidatePath } from "next/cache";

export const removeMemberAction: Action<RemoveMemberSchema> = async ({
  projectId,
  username,
}) => {
  try {
    const token = await getSession();
    if (!token) redirect("/auth");
    const { error, userId } = await verifyJWTAction(token);
    if (error) redirect("/auth");

    await prisma.project.update({
      where: {
        id: projectId,
        creatorId: userId,
      },
      data: {
        members: {
          disconnect: {
            username,
          },
        },
      },
    });

    revalidatePath(`/dashboard/my-projects/${projectId}`);

    return {
      ok: true,
      message: "Member removed from project successfully!",
    };
  } catch {
    return {
      ok: false,
      message: "Something went wrong!",
    };
  }
};
