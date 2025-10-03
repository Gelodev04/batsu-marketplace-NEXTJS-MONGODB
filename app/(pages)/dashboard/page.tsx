import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/auth/logout-button";
import AddProductButton from "@/components/products/add-product-button";
import MyProducts from "@/components/products/my-products";
import Image from "next/image";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  return (
    <div className="p-6">
      <h1 className="text-xl">Welcome {session.user.name}!</h1>
      <p>Your role is: {session.user.role}</p>
      <p>Campus: {session.user.campus}</p>
      <Image
        src={session.user.image || ""}
        alt="Profile"
        width={36}
        height={36}
        className="rounded-full"
      />
      <AddProductButton />
      <LogoutButton />
      <MyProducts />
    </div>
  );
}
