// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/auth/logout-button";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  return (
    <div className="p-6">
      <h1 className="text-xl">Welcome {session.user.name}!</h1>
      <p>Your role is: {session.user.role}</p>
      <LogoutButton />
    </div>
  );
}
