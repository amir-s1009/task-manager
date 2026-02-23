"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function useSetSearchParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (entries: [string, string | null | undefined][]) => {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of entries) {
      if (value === null || value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.replace(newUrl);
  };
}
