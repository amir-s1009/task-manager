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
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/styles";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { EditTaskSchema } from "@/schema/projects/editTask.schema";
import { TaskEntity } from "@/entities/tasks/task.entity";

export default function EditTaskModal({
  task,
  onEditTask,
  projectMembers,
}: {
  task: TaskEntity;
  onEditTask?: Action<EditTaskSchema>;
  projectMembers: ProfileEntity[];
}) {
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState<EditTaskSchema>({
    id: task.id,
    title: task.title,
    description: task.description ?? undefined,
    assignedUserusernames: task.assignedUsers.map((user) => user.username),
    checkListItems: [...task.checkListItems, { content: "", isDone: false }],
  });

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!onEditTask) return;
    if (isPending) return;
    setIsPending(true);
    const result = await onEditTask({
      id: formData.id,
      title: formData.title,
      description: formData.description || undefined,
      assignedUserusernames: formData.assignedUserusernames,
      checkListItems: formData.checkListItems.filter((item) => item.content),
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
            <DialogTitle>Task Preview</DialogTitle>
            <DialogDescription>
              {"You preview the task details here"}
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-5 mt-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>Task Title</Label>
              <Input
                name="title"
                value={formData.title}
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
                value={formData.description}
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
                      disabled={!(task.iAmCreator || task.iAmMember)}
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
                      disabled={!(task.iAmCreator || task.iAmMember)}
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
                    {(index === formData.checkListItems.length - 1 ||
                      task.iAmCreator ||
                      task.iAmMember) && (
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
                    {formData.checkListItems.length > 1 &&
                      (task.iAmCreator || task.iAmMember) && (
                        <Button
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
                        </Button>
                      )}
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="gap-1">
              <CardHeader>Assign members to this task</CardHeader>
              <CardContent className="flex justify-start gap-3 items-center flex-wrap">
                {(task.iAmCreator
                  ? projectMembers
                  : projectMembers.filter((member) =>
                      formData.assignedUserusernames.includes(member.username)
                    )
                ).map((member) => (
                  <Badge
                    key={member.username}
                    onClick={() => {
                      if (!task.iAmCreator) return;
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

            {(task.iAmCreator || task.iAmMember) && (
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
                  {isPending ? "Editing..." : "Edit"}
                </Button>
              </div>
            )}
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
