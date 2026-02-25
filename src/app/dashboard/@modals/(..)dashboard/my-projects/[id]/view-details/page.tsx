import { addMemberAction } from "@/actions/projects/addMember.action";
import { changeProjectStatusAction } from "@/actions/projects/changeProjectStatus.action";
import { getProjectDetailsInfoAction } from "@/actions/projects/getProjectDetailsInfo.action";
import { searchUserAction } from "@/actions/projects/onSearchUser.action";
import { removeMemberAction } from "@/actions/projects/removeMember.action";
import ViewProjectDetailsModal from "@/components/features/projects/viewProjectDetailsModal";

export default async function ViewProjectDetailModalServer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projectDetails = await getProjectDetailsInfoAction({ id });
  if (!projectDetails.ok) throw new Error(projectDetails.message);
  if (!projectDetails.data) throw new Error("No data found!");
  return (
    <ViewProjectDetailsModal
      projectDetails={projectDetails.data}
      onAddMember={addMemberAction}
      onRemoveMember={removeMemberAction}
      onChangeProjectStatus={changeProjectStatusAction}
      onSearchUser={searchUserAction}
    />
  );
}
