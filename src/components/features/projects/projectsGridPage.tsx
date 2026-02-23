"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProjectListItemEntity } from "@/entities/projects/projectListItem.entity";
import { useRouter } from "next/navigation";
import ProjectCard from "./projectCard";
import { Action } from "@/core/ports/action.port";
import { ChangeProjectStatusSchema } from "@/schema/projects/changeProjectStatus.schema";
import { DeleteProjectSchema } from "@/schema/projects/deleteProject.schema";
import { useState } from "react";

export default function ProjectsGridPage({
  projects,
  onChangeProjectStatus,
  onDeleteProject,
}: {
  projects: ProjectListItemEntity[];
  onChangeProjectStatus: Action<ChangeProjectStatusSchema>;
  onDeleteProject: Action<DeleteProjectSchema>;
}) {
  const [projectsData, setProjectsData] =
    useState<ProjectListItemEntity[]>(projects);
  const router = useRouter();

  const handleDeleteProject = async ({ id }: { id: string }) => {
    setProjectsData((prev) => prev.filter((item) => item.id !== id));
    return onDeleteProject({
      id,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">My Projects</h1>
        <Button onClick={() => router.push("/dashboard/my-projects/create")}>
          Create Project
        </Button>
      </div>

      {projects.length === 0 && (
        <p className="text-neutral-500 text-md mx-auto text-center">
          No any projects yet
        </p>
      )}
      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projectsData.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.1,
            }}
            whileHover={{ y: -4 }}
          >
            <ProjectCard
              project={project}
              onChangeProjectStatus={onChangeProjectStatus}
              onDeleteProject={handleDeleteProject}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
