"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Action } from "@/core/ports/action.port";
import { ProfileEntity } from "@/entities/profile/profile.entity";
import { CreateTaskSchema } from "@/schema/projects/createTask.schema";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/styles";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";

export default function CreateTaskModal({
  onCreateTask,
  projectId,
  projectMembers,
}: {
  onCreateTask: Action<CreateTaskSchema>;
  projectId: string;
  projectMembers: ProfileEntity[];
}) {
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState<CreateTaskSchema>({
    title: "",
    description: "",
    projectId,
    assignedUserusernames: [],
    checkListItems: [{ content: "", isDone: false }],
  });

  const router = useRouter();

  const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;
    setIsPending(true);
    const result = await onCreateTask({
      projectId,
      title: formData.title,
      description: formData.description || undefined,
      assignedUserusernames: formData.assignedUserusernames,
      checkListItems: formData.checkListItems.filter(item => item.content),
    });
    if (result.ok) {
      toast.success(result.message ?? "");
      router.back();
    } else {
      toast.error(result.message ?? "");
    }
    setIsPending(false);
  };

  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogContent className="sm:max-w-2xl overflow-y-auto max-h-[95%] rounded-2xl [scrollbar-width:none]">
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25 }}
        >
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              {"Let's create and assign tasks to others"}
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-5 mt-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>Task Title</Label>
              <Input
                name="title"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g. Refactor the login UI"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea
                name="description"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value || undefined,
                  }))
                }
                placeholder="Short description about the task..."
                rows={3}
              />
            </div>

            <Card className="gap-1">
              <CardHeader>You can have a check list here</CardHeader>
              <CardContent className="space-y-1">
                {formData.checkListItems.map((checkListItem, index) => (
                  <div
                    key={index}
                    className="flex justify-start gap-2 items-center"
                  >
                    <Checkbox
                      className="p-3 flex justify-center items-center transition-all duration-200"
                      checked={checkListItem.isDone}
                      onClick={() => {
                        setFormData((prev) => {
                          return {
                            ...prev,
                            checkListItems: prev.checkListItems.map(
                              (mapItem, mapIndex) => {
                                return {
                                  content: mapItem.content,
                                  isDone:
                                    mapIndex === index
                                      ? !mapItem.isDone
                                      : mapItem.isDone,
                                };
                              }
                            ),
                          };
                        });
                      }}
                    />
                    <Input
                      placeholder="New check list item..."
                      value={checkListItem.content}
                      onChange={(e) => {
                        setFormData((prev) => {
                          return {
                            ...prev,
                            checkListItems: prev.checkListItems.map(
                              (mapItem, mapIndex) => {
                                return {
                                  content:
                                    mapIndex === index
                                      ? e.target.value
                                      : mapItem.content,
                                  isDone: mapItem.isDone,
                                };
                              }
                            ),
                          };
                        });
                      }}
                    />
                    {index === formData.checkListItems.length - 1 && (
                      <Button
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            checkListItems: [
                              ...prev.checkListItems,
                              { content: "", isDone: false },
                            ],
                          }))
                        }
                        variant="outline"
                        type="button"
                        size="icon"
                      >
                        <Plus />
                      </Button>
                    )}
                    {formData.checkListItems.length > 1 && <Button
                      onClick={() => {
                        setFormData((prev) => {
                          return {
                            ...prev,
                            checkListItems: prev.checkListItems.filter(
                              (_, filterIndex) => index !== filterIndex
                            ),
                          };
                        });
                      }}
                      variant="outline"
                      type="button"
                      size="icon"
                    >
                      <Trash2 className="text-red-500" />
                    </Button>}
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="gap-1">
              <CardHeader>Assign members to this task</CardHeader>
              <CardContent className="flex justify-start gap-3 items-center flex-wrap">
                {projectMembers.map((member) => (
                  <Badge
                    key={member.username}
                    onClick={() => {
                      if (
                        formData.assignedUserusernames.find(
                          (username) => username === member.username
                        )
                      ) {
                        setFormData((prev) => ({
                          ...prev,
                          assignedUserusernames:
                            prev.assignedUserusernames.filter(
                              (username) => username !== member.username
                            ),
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          assignedUserusernames: [
                            ...prev.assignedUserusernames,
                            member.username,
                          ],
                        }));
                      }
                    }}
                    className={cn(
                      "text-sm cursor-pointer",
                      formData.assignedUserusernames.find(
                        (username) => username === member.username
                      )
                        ? "bg-cyan-600 text-white text-sm"
                        : "bg-white text-black border border-cyan-600"
                    )}
                  >
                    {member.full_name}
                  </Badge>
                ))}
              </CardContent>
            </Card>

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
