"use server";

import { getSession } from "@/utils/cookie";
import { redirect } from "next/navigation";
import { verifyJWTAction } from "../verifyJWT.action";
import { prisma } from "@/db/prisma";
import { Action } from "@/core/ports/action.port";
import { GetProjectDetailSchema } from "@/schema/projects/getProjectDetail.schema";
import { ProjectEntity } from "@/entities/projects/project.entity";

export const getProjectDetailAction: Action<
  GetProjectDetailSchema,
  ProjectEntity
> = async ({ id }) => {
  try {
    const token = await getSession();
    if (!token) redirect("/auth");
    const { userId, error } = await verifyJWTAction(token);
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
        _count: {
          select: {
            members: true,
          },
        },
        messages: {
          include: {
            sender: {
              select: {
                full_name: true,
                username: true,
              },
            },
            task: {
              select: {
                id: true,
                title: true,
                description: true,
                isAcomplished: true,
                assignedUsers: {
                  select: {
                    full_name: true,
                    username: true,
                  },
                },
              },
            },
          },
        },
        creator: {
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
        messages: project.messages.map((message) => ({
          id: message.id,
          iAmSender: message.senderId === userId,
          sender: message.sender,
          sentAt: message.sentAt.toISOString(),
          content: message.content,
          privateRecepient: message.privateRecepientId,
          projectRecepientId: message.projectRecepientId,
          task: message.task
            ? {
                id: message.task.id,
                title: message.task.title,
                description: message.task.description,
                isAcomplished: message.task.isAcomplished,
                assignedUsers: message.task.assignedUsers,
              }
            : undefined,
        })),
        membersCount: project._count.members,
      },
    };
  } catch {
    return {
      ok: false,
      message: "Something went wrong!",
    };
  }
};
