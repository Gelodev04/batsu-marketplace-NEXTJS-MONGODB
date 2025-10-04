"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useCreateProduct } from "@/hooks/useCreateProduct";
import ImageDropzone from "../ui/image-dropzone";
import { useImageUpload } from "@/hooks/useImageUpload";

export default function AddProductForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("1");
  const [condition, setCondition] = useState<"new" | "used">("used");
  const [images, setImages] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const { createProduct, loading, error, setError } = useCreateProduct();
  const [files, setFiles] = useState<File[]>([]);
  const { uploadImages, uploading } = useImageUpload();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploading) {
      toast.warning("Please wait for images to finish uploading");
      return;
    }

    if (!title.trim() || !description.trim() || !price || files.length === 0) {
      toast.error(
        "Please fill in all required fields and upload at least one image"
      );
      return;
    }

    try {
      const uploadedUrls = await uploadImages(files);
      const payload = {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        stock: Number(stock),
        condition,
        images: uploadedUrls,
        tags: tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const res = await createProduct(payload);

      if (!res.ok) {
        toast.error(res.error || "Product creation failed");
        return;
      }

      toast.success("Product created");
      onSuccess?.();

      setTitle("");
      setDescription("");
      setPrice("");
      setStock("1");
      setCondition("used");
      setImages("");
      setTags("");
      setFiles([]);
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Something went wrong while creating the product");
    }
  };

  return (
    <form onSubmit={handleCreate} className="space-y-4" noValidate>
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        {/* replace with your Textarea component or a textarea */}
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={loading}
          style={{ resize: "none" }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="price">Price₱</Label>
          <Input
            id="price"
            type="number"
            min={0}
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            min={0}
            step="1"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label>Condition</Label>
        <Select
          value={condition}
          onValueChange={(v) => setCondition(v as "new" | "used")}
          disabled={loading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="used">Used</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label>Images</Label>
        <ImageDropzone onFilesChange={setFiles} maxFiles={8} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          disabled={loading}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading || uploading}>
        {loading ? "Creating..." : "Create Product"}
      </Button>
    </form>
  );
}
