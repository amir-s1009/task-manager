export type EditTaskSchema = {
  id: string;
  title: string;
  description?: string;
  assignedUserusernames: string[];
  checkListItems: {
    id?: string;
    content: string;
    isDone: boolean;
  }[];
};
