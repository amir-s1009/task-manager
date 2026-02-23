'use server';

import { getSession } from "@/utils/cookie";
import { redirect } from "next/navigation";
import { verifyJWTAction } from "../verifyJWT.action";
import { prisma } from "@/db/prisma";
import { Action } from "@/core/ports/action.port";
import { CreateMessageSchema } from "@/schema/messages/createMessage.schema";

export const createMessageAction: Action<CreateMessageSchema> = async ({
  content,
  privateRecepientId,
  projectRecepientId,
}) => {
  try {
    const token = await getSession();
    if (!token) redirect("/auth");
    const { userId, error } = await verifyJWTAction(token);
    if (error) redirect("/auth");

    await prisma.message.create({
      data: {
        content,
        privateRecepientId,
        projectRecepientId,
        senderId: userId!,
      },
    });

    return {
      ok: true,
      message: "Your message sent.",
    };
  } catch {
    return {
      ok: false,
      message: "Something went wrong!",
    };
  }
};
