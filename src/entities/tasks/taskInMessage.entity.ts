import { ProfileEntity } from "../profile/profile.entity";

export type TaskInMessageEntity = {
  id: string;
  title: string;
  description?: string | null;
  assignedUsers: ProfileEntity[];
  isAcomplished: boolean;
};
