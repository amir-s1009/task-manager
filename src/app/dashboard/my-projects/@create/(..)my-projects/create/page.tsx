import { createProjectAction } from "@/actions/projects/createProject.action";
import CreateProjectModal from "@/components/features/projects/createProjectModal";

export default function CreateProjectModalServer() {
  return <CreateProjectModal onSubmit={createProjectAction} />;
}
