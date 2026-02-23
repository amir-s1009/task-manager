import { PROJECT_STATUS } from "@prisma/client";

export type ProjectListItemEntity = {
  id: string;
  title: string;
  description?: string | null;
  status: PROJECT_STATUS;
  isDeleted: boolean;
  createdAt: string;
  tasksCount: number;
  membersCount: number;
};
