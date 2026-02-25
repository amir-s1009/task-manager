import { getDashboardInfoAction } from "@/actions/dashboard/getDashboardInfo.action";
import DashboardPage from "@/components/features/dashboard/dashboardPage";

export default async function DashboardPageServer() {
  const dashboardInfo = await getDashboardInfoAction(undefined);
  if (!dashboardInfo.ok) throw new Error(dashboardInfo.message);
  if (!dashboardInfo.data) throw new Error("No data found!");
  return <DashboardPage dashboard={dashboardInfo.data} />;
}
