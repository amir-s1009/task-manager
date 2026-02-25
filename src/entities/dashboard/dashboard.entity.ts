import { PROJECT_STATUS } from "@prisma/client";

export type DashboardProjectPreview = {
  id: string;
  title: string;
  status: PROJECT_STATUS;
};

export type DashboardTaskPreview = {
  id: string;
  title: string;
  isAcomplished: boolean;
};

export type DashboardStats = {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
};

export type DashboardEntity = {
  stats: DashboardStats;
  recentProjects: DashboardProjectPreview[];
  recentTasks: DashboardTaskPreview[];
};
