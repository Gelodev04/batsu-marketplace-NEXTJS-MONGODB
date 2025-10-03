import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/auth/logout-button";
import AddProductButton from "@/components/products/add-product-button";
import MyProducts from "@/app/(pages)/profile/components/my-products";
import Image from "next/image";
import DashboardContent from "./components/profile-content";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  return <DashboardContent />;
}
