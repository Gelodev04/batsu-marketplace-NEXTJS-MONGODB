import { useState } from "react";
import { toast } from "sonner";

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);

  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];

    setUploading(true);
    try {
      const form = new FormData();
      files.forEach((file) => form.append("files", file));

      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const json = await res.json();
      return json.urls as string[];
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload images");
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImages,
    uploading,
  };
}
