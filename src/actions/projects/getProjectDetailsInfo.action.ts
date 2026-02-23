import { Action } from "@/core/ports/action.port";
import { ProjectDetailsEntity } from "@/entities/projects/projectDetails.entity";
import { GetProjectDetailSchema } from "@/schema/projects/getProjectDetail.schema";
import { getSession } from "@/utils/cookie";
import { redirect } from "next/navigation";
import { verifyJWTAction } from "../verifyJWT.action";
import { prisma } from "@/db/prisma";

export const getProjectDetailsInfoAction: Action<
  GetProjectDetailSchema,
  ProjectDetailsEntity
> = async ({ id }) => {
  try {
    const token = await getSession();
    if (!token) redirect("/auth");
    const { error, userId } = await verifyJWTAction(token);
    if (error) redirect("/auth");

    const project = await prisma.project.findUnique({
      where: {
        id,
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
      include: {
        creator: {
          select: {
            full_name: true,
            username: true,
          },
        },
        members: {
          select: {
            full_name: true,
            username: true,
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
      data: {
        id: project.id,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        creator: project.creator,
        isDeleted: project.isDeleted,
        status: project.status,
        title: project.title,
        description: project.description,
        members: project.members,
      },
    };
  } catch {
    return {
      ok: false,
      message: "Something went wrong!",
    };
  }
};
