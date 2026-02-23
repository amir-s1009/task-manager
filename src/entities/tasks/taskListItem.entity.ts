import { ProfileEntity } from "../profile/profile.entity";

export type TaskListItemEntity = {
  id: string;
  title: string;
  description?: string | null;
  assignedUsers: ProfileEntity[];
};
