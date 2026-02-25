import { ProfileEntity } from "../profile/profile.entity";
import { TaskInMessageEntity } from "../tasks/taskInMessage.entity";

export type MessageEntity = {
  id: string;
  content?: string | null;
  sentAt: string;
  sender: ProfileEntity;
  privateRecepient?: string | null;
  projectRecepientId?: string | null;
  task?: TaskInMessageEntity | null;
  iAmSender: boolean;
};
