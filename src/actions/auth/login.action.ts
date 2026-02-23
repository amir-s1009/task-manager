'use server';

import { Action } from "@/core/ports/action.port";
import { prisma } from "@/db/prisma";
import { LoginEntity } from "@/entities/auth/auth.login.entity";
import { LoginSchema } from "@/schema/auth/auth.login.schema";
import { SignJWT } from "jose";

export const loginAction: Action<LoginSchema, LoginEntity> = async ({
  username,
  password,
}) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        username,
        password,
      },
    });

    if (!user) {
      return { ok: false, message: "Invalid credentials" };
    }

    const secret = process.env.ACCESS_TOKEN_KEY;
    if (!secret) {
      throw new Error("ACCESS_TOKEN_KEY is not defined in env");
    }

    const encoder = new TextEncoder();
    const secretKey = encoder.encode(secret);

    const token = await new SignJWT({
      id: user.id,
      username: user.username,
      full_name: user.full_name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(secretKey);

    return {
      ok: true,
      data: {
        accessToken: token,
      },
    };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Something went wrong" };
  }
};
