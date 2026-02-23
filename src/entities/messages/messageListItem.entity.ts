import { ProfileEntity } from "../profile/profile.entity";
import { TaskListItemEntity } from "../tasks/taskListItem.entity";

export type MessageEntity = {
  id: string;
  content?: string | null;
  sentAt: string;
  sender: ProfileEntity;
  privateRecepient?: string | null;
  projectRecepientId?: string | null;
  task?: TaskListItemEntity | null;
  iAmSender: boolean;
};
