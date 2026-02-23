"use server";

import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export async function getCookie(key: string) {
  try {
    const cookieStore = await cookies();
    const value = cookieStore.get(key);
    return value?.value;
  } catch {
    return undefined;
  }
}

export async function setCookie(
  key: string,
  value: string,
  cookie?: Partial<ResponseCookie>
) {
  try {
    const cookieStore = await cookies();
    cookieStore.set(key, value, { ...cookie });
    return value;
  } catch {
    return undefined;
  }
}

export async function removeCookie(key: string) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(key);
    return key;
  } catch {
    return undefined;
  }
}

export async function getSession() {
  return await getCookie("accessToken");
}

export async function setSession({ accessToken }: { accessToken: string }) {
  await setCookie("accessToken", accessToken);
}

export async function removeSession() {
  await removeCookie("accessToken");
}
