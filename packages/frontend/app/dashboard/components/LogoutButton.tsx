"use client";

import Button from "@/components/ui/Buttons";
import { signOut } from "next-auth/react";
import { useDisconnect } from "wagmi";

export default function LogoutButton() {
  const { disconnect } = useDisconnect();

  const handleLogout = async () => {
    disconnect();
    await signOut({ callbackUrl: "/" });
  };
  return (
    <Button variant="primary" size="sm" onClick={handleLogout}>
      Logout
    </Button>
  );
}
