import { getProfileAction } from "@/actions/profile/getProfile.action";
import DashboardLayout from "@/components/features/dashboard/dashboardLayout";
import { ReactNode } from "react";

export default async function DashboardLayoutServer({
  children,
  modals,
}: {
  children: ReactNode;
  modals: ReactNode;
}) {
  const profile = await getProfileAction(undefined);
  if (!profile.ok) throw new Error(profile.message);
  if (!profile.data) throw new Error("No profile data found!");

  return (
    <DashboardLayout profile={profile.data}>
      <>
        {children}
        {modals}
      </>
    </DashboardLayout>
  );
}
