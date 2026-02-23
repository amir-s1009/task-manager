"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Action } from "@/core/ports/action.port";
import { LoginEntity } from "@/entities/auth/auth.login.entity";
import { LoginSchema } from "@/schema/auth/auth.login.schema";
import { setSession } from "@/utils/cookie";
import { cn } from "@/utils/styles";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function LoginCard({
  onLogin,
}: {
  onLogin: Action<LoginSchema, LoginEntity>;
}) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setIsPending(true);
    const result = await onLogin({
      username: form.get("username") as string,
      password: form.get("password") as string,
    });
    setIsPending(false);
    if (result.ok) {
      await setSession({
        accessToken: result.data!.accessToken,
      });
      router.push("/dashboard");
    } else {
      toast.error(result.message ?? "");
    }
  };
  return (
    <form className="space-y-4 mt-4" onSubmit={handleLogin}>
      <div className="space-y-2">
        <Label>Username</Label>
        <Input name="username" placeholder="your_username" required />
      </div>

      <div className="space-y-2">
        <Label>Password</Label>
        <Input
          name="password"
          type="password"
          placeholder="••••••••"
          required
        />
      </div>

      <Button
        disabled={isPending}
        className={cn("w-full mt-2", isPending && "animate-pulse")}
        type="submit"
      >
        {isPending ? "Logging In..." : "Login"}
      </Button>
    </form>
  );
}
