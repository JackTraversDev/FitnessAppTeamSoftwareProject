import { redirect } from "next/navigation";
import IronSessionSettings from "@/lib/util/IronSessionSettings";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await IronSessionSettings();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return <DashboardClient />;
}