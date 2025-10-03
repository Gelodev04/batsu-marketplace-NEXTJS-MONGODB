"use client";

import { useState, useEffect } from "react";
import LogoutButton from "@/components/auth/logout-button";
import AddProductButton from "@/components/products/add-product-button";
import MyProducts from "@/app/(pages)/profile/components/my-products";
import ProfileUpdateForm from "./profile-update-form";
import { getUserProfile, UserProfile } from "../services/user";
import ProfileHeader from "./profile-header";

export default function DashboardContent() {
  return (
    <div className="p-6">
      <ProfileHeader />

      <AddProductButton />
      <LogoutButton />
      <MyProducts />
    </div>
  );
}
