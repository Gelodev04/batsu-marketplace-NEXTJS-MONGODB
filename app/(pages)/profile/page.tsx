import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ProfileContent from "./components/profile-content";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  return <ProfileContent />;
}
