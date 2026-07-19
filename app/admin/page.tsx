import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/require-auth";
import { AdminDashboard } from "./AdminDashboard";

export default async function AdminPage() {
  if (!(await isAuthed())) {
    redirect("/admin/login");
  }
  return <AdminDashboard />;
}
