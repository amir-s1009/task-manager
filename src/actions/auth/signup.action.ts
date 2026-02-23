'use server';

import { Action } from "@/core/ports/action.port";
import { prisma } from "@/db/prisma";
import { SignupEntity } from "@/entities/auth/auth.signup.entity";
import { SignupSchema } from "@/schema/auth/auth.signup.schema";
import { SignJWT } from "jose";

export const signupAction: Action<SignupSchema, SignupEntity> = async ({
  username,
  password,
  full_name,
}) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (user) {
      return { ok: false, message: "Username Already exists" };
    }

    const userCreated = await prisma.user.create({
      data: {
        full_name,
        username,
        password,
      },
    });

    const secret = process.env.ACCESS_TOKEN_KEY;
    if (!secret) {
      throw new Error("ACCESS_TOKEN_KEY is not defined in env");
    }

    const encoder = new TextEncoder();
    const secretKey = encoder.encode(secret);

    const token = await new SignJWT({
      id: userCreated.id,
      username: userCreated.username,
      full_name: userCreated.full_name,
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
