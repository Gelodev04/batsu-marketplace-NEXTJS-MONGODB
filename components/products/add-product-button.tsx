"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import AddProductForm from "@/components/form/add-product-form";

export default function AddProductButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button color="secondary">Add Product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
          <DialogDescription>Fill the details below to list your item.</DialogDescription>
        </DialogHeader>

        <AddProductForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}