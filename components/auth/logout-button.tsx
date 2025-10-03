"use client";

import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

export default function LogoutButton() {
  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <Button onClick={handleLogout} variant="outline" >
      Logout
    </Button>
  );
}
