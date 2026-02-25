import { ProfileEntity } from "../profile/profile.entity";

export type TaskEntity = {
  id: string;
  title: string;
  description?: string | null;
  progressIndex?: number | null;
  isAcomplished: boolean;
  iAmCreator: boolean;
  iAmMember: boolean;
  assignedUsers: ProfileEntity[];
  checkListItems: {
    id: string;
    content: string;
    isDone: boolean;
  }[];
};
