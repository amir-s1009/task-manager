'use server';

import { Action } from "@/core/ports/action.port";
import { prisma } from "@/db/prisma";
import { CreateProjectSchema } from "@/schema/projects/createProject.schema";
import { getSession } from "@/utils/cookie";
import { verifyJWTAction } from "../verifyJWT.action";
import { redirect } from "next/navigation";

export const createProjectAction: Action<CreateProjectSchema> = async ({
  title,
  description,
}) => {
  try {
    const token = await getSession();
    if (!token) redirect("/auth");
    const { userId, error } = await verifyJWTAction(token);
    if (error) redirect("/auth");

    const projectExistingWithTitleAndCreator = await prisma.project.findFirst({
      where: {
        creatorId: userId,
        title,
      },
    });
    if (projectExistingWithTitleAndCreator)
      return {
        ok: false,
        message: `You have already created project with title of ${title}!`,
      };

    await prisma.project.create({
      data: {
        title,
        description,
        creatorId: userId!,
      },
    });

    return {
      ok: true,
      message: "Your project created successfully!",
    };
  } catch {
    return {
      ok: false,
      message: "Something went wrong!",
    };
  }
};
