'use client';

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  User,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ProfileEntity } from "@/entities/profile/profile.entity";
import { removeSession } from "@/utils/cookie";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Projects",
    href: "/dashboard/my-projects",
    icon: FolderKanban,
  },
  {
    title: "Tasks",
    href: "/dashboard/my-tasks",
    icon: CheckSquare,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
];

export default function DashboardLayout({
  children,
  profile,
}: {
  children: ReactNode;
  profile: ProfileEntity;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await removeSession();
    router.push("/auth");
  };

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background flex flex-col">
        <div className="p-6 text-xl font-bold tracking-tight">Task Manager</div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = (item.href === "/dashboard" && pathname === "/dashboard") || (pathname.startsWith(item.href) && item.href !== "/dashboard")
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon size={18} />
                  {item.title}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
            onClick={handleLogout}
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 border-b bg-background flex items-center justify-between px-6">
          <div className="text-sm text-muted-foreground">
            Welcome back,
            <span className="font-semibold text-foreground ml-1">
              {profile.full_name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                {profile.full_name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <Separator />

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
