
import { checkRole } from "@/utils/roles";
import AdminPageContent from "./components/AdminPageContent";
import { redirect } from "next/navigation";

export default function AdminPage() {
 
  if (!checkRole("admin")) {
    redirect("/");
  }
  return <AdminPageContent />;
}
