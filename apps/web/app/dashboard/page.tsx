import { auth } from "@/lib/auth";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  const session = await auth();

  const user = {
    name: session?.user?.name || "User",
    email: session?.user?.email || "",
    id: session?.user?.id || "",
  };

  return <DashboardClient user={user} />;
}

