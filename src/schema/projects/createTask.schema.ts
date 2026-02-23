export type CreateTaskSchema = {
  projectId: string;
  title: string;
  description?: string;
  assignedUserusernames:string[];
  checkListItems: {
    content: string;
    isDone: boolean;
  }[];
};
