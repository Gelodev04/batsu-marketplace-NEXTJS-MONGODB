"use client";

import MyProducts from "@/app/(pages)/profile/components/my-products";
import ProfileHeader from "./profile-header";

export default function ProfileContent() {
  return (
    <div className="p-6">
      <ProfileHeader />
      <MyProducts />
    </div>
  );
}
