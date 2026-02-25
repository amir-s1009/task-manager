import { createMessageAction } from "@/actions/messages/createMessage.action";
import { getProfileAction } from "@/actions/profile/getProfile.action";
import { getProjectDetailAction } from "@/actions/projects/getProjectDetail.action";
import { changeTaskAcomplishmentAction } from "@/actions/tasks/changeTaskAcomplishment.action";
import ProjectDetailPage from "@/components/features/projects/projectDetailPage";

export default async function ProjectDetailPageServer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getProfileAction(undefined);
  if (!profile.ok) throw new Error(profile.message);
  if (!profile.data) throw new Error("Error retrieving user profile");

  const project = await getProjectDetailAction({ id });
  if (!project.ok) throw new Error(project.message);
  if (!project.data) throw new Error("No data found!");
  return (
    <ProjectDetailPage
      project={project.data}
      profile={profile.data}
      onSendMessage={createMessageAction}
      onChangeTaskAcomplishment={changeTaskAcomplishmentAction}
    />
  );
}
