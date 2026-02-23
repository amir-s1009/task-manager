import { jwtVerify } from "jose";

export async function verifyJWTAction(token: string): Promise<{
  userId?: string;
  error?: string;
}> {
  try {
    const secret = process.env.ACCESS_TOKEN_KEY;

    if (!secret) {
      return { error: "Access token key is not defined" };
    }

    const encoder = new TextEncoder();
    const secretKey = encoder.encode(secret);

    const { payload } = await jwtVerify(token, secretKey);

    return { userId: (payload as { id: string }).id };
  } catch {
    return { error: "Invalid or expired token" };
  }
}
