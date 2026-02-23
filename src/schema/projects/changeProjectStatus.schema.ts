import { PROJECT_STATUS } from "@prisma/client";

export type ChangeProjectStatusSchema = {
  id: string;
  status: PROJECT_STATUS;
};
