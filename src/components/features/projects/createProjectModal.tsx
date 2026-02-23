"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { CreateProjectSchema } from "@/schema/projects/createProject.schema";
import { Action } from "@/core/ports/action.port";
import { toast } from "sonner";

type CreateProjectModalProps = {
  onSubmit: Action<CreateProjectSchema>;
};

export default function CreateProjectModal({
  onSubmit,
}: CreateProjectModalProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const title = form.get("title") as string;
    const description = form.get("description") as string;

    setIsPending(true);
    const result = await onSubmit({
      title,
      description: description || undefined,
    });
    setIsPending(false);

    if (result.ok) {
      toast.success(result.message ?? "");
      router.push("/dashboard/my-projects");
      router.refresh();
    } else {
      toast.error(result.message ?? "");
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogTrigger asChild>
        <Button>Create Project</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl">
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25 }}
        >
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Start something great. Give your project a name.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-5 mt-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>Project Title</Label>
              <Input
                name="title"
                placeholder="e.g. Website Redesign"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea
                name="description"
                placeholder="Short description about the project..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                disabled={isPending}
                variant="ghost"
                onClick={() => router.back()}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isPending}>
                {isPending ? "Createing..." : "Create"}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
