import { getProjectMembersAction } from "@/actions/projects/getProjectMembers.action";
import { createTaskAction } from "@/actions/tasks/createTask.action";
import CreateTaskModal from "@/components/features/projects/createTaskModal";

export default async function CreateTaskModalServer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const members = await getProjectMembersAction({
    projectId: id,
  });
  if (!members.ok) throw new Error(members.message);
  if (!members.data) throw new Error("No members found!");
  return (
    <CreateTaskModal
      onCreateTask={createTaskAction}
      projectId={id}
      projectMembers={members.data}
    />
  );
}
