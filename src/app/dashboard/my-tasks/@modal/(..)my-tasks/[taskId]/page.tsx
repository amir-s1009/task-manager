import { getProjectMembersAction } from "@/actions/projects/getProjectMembers.action";
import { editTaskAction } from "@/actions/tasks/editTask.action";
import { getTaskAction } from "@/actions/tasks/getTask.action";
import EditTaskModal from "@/components/features/projects/editTaskModal";

export default async function EditTaskModalServer({
  searchParams,
  params,
}: {
  searchParams: Promise<{ projectId: string }>;
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;
  const { projectId } = await searchParams;

  const task = await getTaskAction({ id: taskId });
  if (!task.ok) throw new Error(task.message);
  if (!task.data) throw new Error("No data found!");

  const members = await getProjectMembersAction({
    projectId,
  });
  if (!members.ok) throw new Error(members.message);
  if (!members.data) throw new Error("No members found!");

  return (
    <EditTaskModal
      task={task.data}
      projectMembers={members.data}
      onEditTask={editTaskAction}
    />
  );
}
