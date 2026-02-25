import { changeTaskAcomplishmentAction } from "@/actions/tasks/changeTaskAcomplishment.action";
import { getAllTasksAction } from "@/actions/tasks/getAllTasks.action";
import TasksListViewPage from "@/components/features/tasks/tasksListViewPage";

export default async function MyTasksPage() {
  const tasks = await getAllTasksAction(undefined);
  if (!tasks.ok) throw new Error(tasks.message);
  if (!tasks.data) throw new Error("No data found!");
  return (
    <TasksListViewPage
      tasks={tasks.data}
      onChangeAcomplishment={changeTaskAcomplishmentAction}
    />
  );
}
