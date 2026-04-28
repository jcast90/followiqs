import config from "@/lib/config";
import { SidebarLayout } from "@/components/dashboard/layouts/sidebar-layout";
import { TopNavLayout } from "@/components/dashboard/layouts/topnav";
import { CommandLayout } from "@/components/dashboard/layouts/command-layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const layout = config.dashboard?.layout ?? "sidebar";

  if (layout === "topnav") {
    return <TopNavLayout>{children}</TopNavLayout>;
  }
  if (layout === "command") {
    return <CommandLayout>{children}</CommandLayout>;
  }
  return <SidebarLayout>{children}</SidebarLayout>;
}
