import { getProjectMembersAction } from "@/actions/projects/getProjectMembers.action";
import { createTaskAction } from "@/actions/tasks/createTask.action";
import CreateTaskModal from "@/components/features/projects/createTaskModal";

export default async function CreateTaskModalServer({
  searchParams,
}: {
  searchParams: Promise<{ projectId: string }>;
}) {
  const { projectId } = await searchParams;
  const members = await getProjectMembersAction({
    projectId,
  });
  if (!members.ok) throw new Error(members.message);
  if (!members.data) throw new Error("No members found!");
  return (
    <CreateTaskModal
      onCreateTask={createTaskAction}
      projectId={projectId}
      projectMembers={members.data}
    />
  );
}
