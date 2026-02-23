"use server";

import { Action } from "@/core/ports/action.port";
import { getSession } from "@/utils/cookie";
import { redirect } from "next/navigation";
import { verifyJWTAction } from "../verifyJWT.action";
import { prisma } from "@/db/prisma";
import { SearchUserSchema } from "@/schema/projects/searchUser.schema";
import { ProfileEntity } from "@/entities/profile/profile.entity";

export const searchUserAction: Action<
  SearchUserSchema,
  ProfileEntity
> = async ({ username }) => {
  try {
    const token = await getSession();
    if (!token) redirect("/auth");
    const { error } = await verifyJWTAction(token);
    if (error) redirect("/auth");

    const user = await prisma.user.findFirst({
      where: {
        username,
      },
      select: {
        full_name: true,
        username: true,
      },
    });

    if (!user)
      return {
        ok: false,
        message: "user not found!",
      };

    return {
      ok: true,
      data: {
        username: user.username,
        full_name: user.full_name,
      },
    };
  } catch {
    return {
      ok: false,
      message: "Something went wrong!",
    };
  }
};
