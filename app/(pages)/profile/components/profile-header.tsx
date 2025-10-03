"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ProfileUpdateForm from "./profile-update-form";
import { getUserProfile, UserProfile } from "../services/user";

export default function ProfileHeader() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const result = await getUserProfile();
        if (result.ok) {
          setUserProfile(result.data!.user);
        } else {
          console.error("Failed to fetch user profile:", result.error);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userProfile) {
    return <div>Failed to load profile</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Image
            src={userProfile.image || "/images/user.png"}
            alt="Profile"
            width={48}
            height={48}
            className="rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold">{userProfile.name}!</h1>
            <p className="text-muted-foreground">
              Campus: {userProfile.campus}
            </p>
          </div>
        </div>
        <ProfileUpdateForm
          user={userProfile}
          onProfileUpdate={(updatedUser) => {
            setUserProfile(updatedUser);
          }}
        />
      </div>
    </div>
  );
}
