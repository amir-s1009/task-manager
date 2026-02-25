"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PROJECT_STATUS } from "@prisma/client";
import { ProjectDetailsEntity } from "@/entities/projects/projectDetails.entity";
import { MoreVertical, UserPlus, Trash2, Loader2 } from "lucide-react";
import { Action } from "@/core/ports/action.port";
import { RemoveMemberSchema } from "@/schema/projects/removeMember.schema";
import { AddMemberSchema } from "@/schema/projects/addMember.schema";
import { ChangeProjectStatusSchema } from "@/schema/projects/changeProjectStatus.schema";
import { toast } from "sonner";
import { ProfileEntity } from "@/entities/profile/profile.entity";
import { SearchUserSchema } from "@/schema/projects/searchUser.schema";
import { cn } from "@/utils/styles";

export default function ViewProjectDetailsModal({
  projectDetails,
  onAddMember,
  onRemoveMember,
  onChangeProjectStatus,
  onSearchUser,
}: {
  projectDetails: ProjectDetailsEntity;
  onRemoveMember: Action<RemoveMemberSchema>;
  onAddMember: Action<AddMemberSchema>;
  onChangeProjectStatus: Action<ChangeProjectStatusSchema>;
  onSearchUser: Action<SearchUserSchema, ProfileEntity>;
}) {
  const [projectDetailsData, setProjectDetailsData] =
    useState<ProjectDetailsEntity>(projectDetails);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [usernameToAdd, setUsernameToAdd] = useState("");
  const [userToAdd, setUserToAdd] = useState<ProfileEntity | null>(null);
  const [isSearchingUser, setIsSearchingUser] = useState(false);

  const router = useRouter();

  // ===== Handlers (logic intentionally not implemented) =====

  const handleRemoveMember = async (username: string) => {
    // TODO: implement remove member logic
    setProjectDetailsData((prev) => ({
      ...prev,
      members: prev.members.filter((member) => member.username !== username),
    }));
    const result = await onRemoveMember({
      username,
      projectId: projectDetailsData.id,
    });
    if (!result.ok) {
      toast.error(result.message ?? "");
      router.refresh();
    }
  };

  const handleSearchUserWithUsername = async () => {
    setIsSearchingUser(true);
    const result = await onSearchUser({ username: usernameToAdd });
    setIsSearchingUser(false);
    if (result.ok) {
      if (!result.data) return;
      setUserToAdd(result.data);
    } else {
      setUserToAdd(null);
    }
  };

  const handleAddMember = async () => {
    // TODO: implement add member logic using usernameToAdd
    if (!(userToAdd && usernameToAdd)) return;
    setProjectDetailsData((prev) => ({
      ...prev,
      members: [...prev.members, userToAdd],
    }));
    setAddModalOpen(false);
    const result = await onAddMember({
      username: usernameToAdd,
      projectId: projectDetailsData.id,
    });
    if (!result.ok) {
      toast.error(result.message ?? "");
      router.refresh();
    }
  };

  const handleStatusChange = async (status: PROJECT_STATUS) => {
    // TODO: implement status change logic
    setProjectDetailsData((prev) => ({ ...prev, status }));
    const result = await onChangeProjectStatus({
      id: projectDetailsData.id,
      status,
    });

    if (!result.ok) {
      toast.error(result.message ?? "");
      router.refresh();
    }
  };

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent
        className={cn(
          "max-w-2xl transition-all duration-100",
          addModalOpen && "scale-90"
        )}
      >
        {/* ================= HEADER ================= */}
        <DialogHeader className="space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">
                {projectDetailsData.title}
              </DialogTitle>
              {projectDetailsData.description && (
                <DialogDescription>
                  {projectDetailsData.description}
                </DialogDescription>
              )}
            </div>

            {/* Status Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm">
                  {projectDetailsData.status.replace("_", " ")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {Object.values(PROJECT_STATUS).map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => handleStatusChange(status)}
                  >
                    {status.replace("_", " ")}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Project Stats */}
          <div className="text-xs text-muted-foreground flex flex-wrap gap-3 mt-2">
            <span>
              Created{" "}
              {format(new Date(projectDetailsData.createdAt), "MMM dd, yyyy")}
            </span>
            <span>•</span>
            <span>
              Updated{" "}
              {format(new Date(projectDetailsData.updatedAt), "MMM dd, yyyy")}
            </span>
            <span>•</span>
            <span>{projectDetailsData.members.length} Members</span>
          </div>
        </DialogHeader>

        {/* ================= CREATOR ================= */}
        <Card className="p-4 mt-4">
          <p className="text-sm text-muted-foreground mb-2">Project Creator</p>

          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                {projectDetailsData.creator.full_name[0]}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="font-medium">
                {projectDetailsData.creator.full_name}
              </p>
              <p className="text-xs text-muted-foreground">
                @{projectDetailsData.creator.username}
              </p>
            </div>
          </div>
        </Card>

        {/* ================= MEMBERS ================= */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium">Members</p>

            <Button
              size="sm"
              variant="secondary"
              onClick={() => setAddModalOpen(true)}
            >
              <UserPlus className="mr-2 size-4" />
              Add Member
            </Button>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {projectDetailsData.members.map((member) => (
              <div
                key={member.username}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{member.full_name[0]}</AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="text-sm font-medium">{member.full_name}</p>
                    <p className="text-xs text-muted-foreground">
                      @{member.username}
                    </p>
                  </div>
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRemoveMember(member.username)}
                >
                  <Trash2 className="size-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* ================= ADD MEMBER MINI MODAL ================= */}
        <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Add Member</DialogTitle>
              <DialogDescription>
                Enter the username of the user you want to add.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 mt-4">
              <Input
                placeholder="username"
                value={usernameToAdd}
                onChange={(e) => {
                  setUsernameToAdd(e.target.value);
                  handleSearchUserWithUsername();
                }}
              />

              {isSearchingUser && (
                <p className="text-xs text-neutral-500">
                  searching username{" "}
                  <Loader2 className="animate-spin size-5 text-neutral-500" />
                </p>
              )}
              {!userToAdd && usernameToAdd && !isSearchingUser && (
                <p className="text-xs text-red-500">username not found!</p>
              )}

              {userToAdd && (
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{userToAdd.full_name[0]}</AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-medium">{userToAdd.full_name}</p>
                    <p className="text-xs text-muted-foreground">
                      @{userToAdd.username}
                    </p>
                  </div>
                </div>
              )}

              <Button
                onClick={handleAddMember}
                disabled={!(userToAdd && usernameToAdd)}
              >
                Add to Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
