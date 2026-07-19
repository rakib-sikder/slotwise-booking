import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/require-auth";
import { AppSidebar } from "@/components/admin/AppSidebar";
import { TopBar } from "@/components/admin/TopBar";
import { Toaster } from "@/components/ui/sonner";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthed())) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <AppSidebar businessName="Blue Willow Salon" />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar />
        <div className="flex-1">{children}</div>
      </div>
      <Toaster />
    </div>
  );
}
