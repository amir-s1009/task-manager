"use server";

import { Action } from "@/core/ports/action.port";
import { ProjectListItemEntity } from "@/entities/projects/projectListItem.entity";
import { verifyJWTAction } from "../verifyJWT.action";
import { getSession } from "@/utils/cookie";
import { redirect } from "next/navigation";
import { prisma } from "@/db/prisma";

export const getAllProjectsAction: Action<
  undefined,
  ProjectListItemEntity[]
> = async () => {
  try {
    const token = await getSession();
    if (!token) redirect("/auth");
    const { userId, error } = await verifyJWTAction(token);
    if (error) redirect("/auth");
    const projects = await prisma.project.findMany({
      where: {
        isDeleted:false,
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
        _count: {
          select: {
            members: true,
            messages: {
              where: {
                task: {
                  isNot: null,
                },
              },
            },
          },
        },
      },
    });

    return {
      ok: true,
      data: projects.map((project) => ({
        id: project.id,
        createdAt: project.createdAt as unknown as string,
        status: project.status,
        isDeleted: project.isDeleted,
        title: project.title,
        description: project.description,
        membersCount: project._count.members,
        tasksCount: project._count.messages,
      })),
    };
  } catch {
    return {
      ok: false,
      message: "Something went wrong!",
    };
  }
};
