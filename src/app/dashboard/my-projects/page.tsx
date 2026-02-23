import { changeProjectStatusAction } from "@/actions/projects/changeProjectStatus.action";
import { deleteProjectAction } from "@/actions/projects/deleteProject.action";
import { getAllProjectsAction } from "@/actions/projects/getAllProjects.action";
import ProjectsGridPage from "@/components/features/projects/projectsGridPage";

export default async function MyProjects() {
  const projects = await getAllProjectsAction(undefined);
  if (!projects.ok) throw new Error(projects.message);
  if (!projects.data) throw new Error("No data found!");
  return (
    <ProjectsGridPage
      projects={projects.data}
      onChangeProjectStatus={changeProjectStatusAction}
      onDeleteProject={deleteProjectAction}
    />
  );
}
