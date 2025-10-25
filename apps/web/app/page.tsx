import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function Page() {
  const session = await auth();
  
  // If user is authenticated, redirect to dashboard
  if (session) {
    redirect("/dashboard");
  }
  
  // Otherwise redirect to marketing website login
  redirect(process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3001/auth/login");
}