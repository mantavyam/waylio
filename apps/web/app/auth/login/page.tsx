import { redirect } from "next/navigation";

export default function LoginPage() {
  // Redirect to marketing website login
  redirect(process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3001/auth/login");
}
