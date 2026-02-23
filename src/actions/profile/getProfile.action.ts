'use server';

import { Action } from "@/core/ports/action.port";
import { prisma } from "@/db/prisma";
import { ProfileEntity } from "@/entities/profile/profile.entity";
import { verifyJWTAction } from "../verifyJWT.action";
import { getSession } from "@/utils/cookie";
import { redirect } from "next/navigation";

export const getProfileAction: Action<undefined, ProfileEntity> = async () => {
  const accessToken = await getSession();
  if (!accessToken) redirect("/auth");
  const { userId, error } = await verifyJWTAction(accessToken);
  if (error) redirect("/auth");
  const profile = await prisma.user.findUnique({
    where: {
      id: userId!,
    },
  });
  if (!profile)
    return {
      ok: false,
      message: "User profile not found!",
    };

  return {
    ok: true,
    data: {
      full_name: profile.full_name,
      username: profile.username,
    },
  };
};
