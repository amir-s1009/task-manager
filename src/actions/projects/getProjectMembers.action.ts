'use server';

import { Action } from "@/core/ports/action.port";
import { ProfileEntity } from "@/entities/profile/profile.entity";
import { FetchProjectMembersSchema } from "@/schema/projects/fetchProjectMembers.schema";
import { verifyJWTAction } from "../verifyJWT.action";
import { redirect } from "next/navigation";
import { prisma } from "@/db/prisma";
import { getSession } from "@/utils/cookie";

export const getProjectMembersAction: Action<
  FetchProjectMembersSchema,
  ProfileEntity[]
> = async ({ projectId }) => {
  try {
    const token = await getSession();
    if (!token) redirect("/auth");
    const { userId, error } = await verifyJWTAction(token);
    if (error) redirect("/auth");

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
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
      select: {
        members: {
          select: {
            username: true,
            full_name: true,
          },
        },
      },
    });

    if (!project)
      return {
        ok: false,
        message: "Project doesn't exist!",
      };

    return {
      ok: true,
      data: project.members,
    };
  } catch {
    return {
      ok: false,
      message: "Something went wrong!",
    };
  }
};
