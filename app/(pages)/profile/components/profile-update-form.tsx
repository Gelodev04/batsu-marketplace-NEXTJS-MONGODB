"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CampusSelect from "@/components/select/campus-select";
import { toast } from "sonner";
import Image from "next/image";
import { Upload, User, MapPin } from "lucide-react";
import { updateProfile, uploadImage, UserProfile } from "../services/user";

interface ProfileUpdateFormProps {
  user: UserProfile;
  onProfileUpdate: (updatedUser: UserProfile) => void;
}

export default function ProfileUpdateForm({
  user,
  onProfileUpdate,
}: ProfileUpdateFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    campus: user.campus || "",
    image: user.image || "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(user.image || "");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image;
      
      if (imageFile) {
        const uploadResult = await uploadImage(imageFile);
        if (!uploadResult.ok) {
          throw new Error(uploadResult.error || "Failed to upload image");
        }
        imageUrl = uploadResult.data!.url;
      }

      const result = await updateProfile({
        name: formData.name,
        campus: formData.campus,
        image: imageUrl,
      });

      if (!result.ok) {
        throw new Error(result.error);
      }

      onProfileUpdate(result.data!.user);
      setOpen(false);
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: user.name || "",
      campus: user.campus || "",
      image: user.image || "",
    });
    setImageFile(null);
    setImagePreview(user.image || "");
  };

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open, user]);

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
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Picture */}
          <div className="space-y-2">
            <Label htmlFor="profile-image">Profile Picture</Label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Image
                  src={imagePreview || "/images/user.png"}
                  alt="Profile preview"
                  width={60}
                  height={60}
                  className="rounded-full object-cover border-2 border-gray-200"
                />
              </div>
              <div className="flex-1">
                <Input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG up to 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Campus */}
          <div className="space-y-2">
            <Label htmlFor="campus">Campus</Label>
            <CampusSelect
              value={formData.campus as any}
              onChange={(value) => handleInputChange("campus", value)}
              placeholder="Select your campus"
            />
          </div>

          {/* Email (read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user.email}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
