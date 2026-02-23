import { PROJECT_STATUS } from "@prisma/client";
import { ProfileEntity } from "../profile/profile.entity";

export type ProjectDetailsEntity = {
  id: string;
  title: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  status: PROJECT_STATUS;
  isDeleted: boolean;
  creator: ProfileEntity;
  members: ProfileEntity[];
};
