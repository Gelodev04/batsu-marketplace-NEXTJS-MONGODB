"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "lucide-react";
import ProfileUpdateForm from "../form/profile-update-form";
import { UserProfile } from "../../services/user";

interface EditProfileButtonProps {
  user: UserProfile;
  onProfileUpdate: (updatedUser: UserProfile) => void;
}

export default function EditProfileButton({
  user,
  onProfileUpdate,
}: EditProfileButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <User className="h-4 w-4" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile information here.
          </DialogDescription>
        </DialogHeader>
        <ProfileUpdateForm
          user={user}
          onProfileUpdate={(updatedUser) => {
            onProfileUpdate(updatedUser);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
