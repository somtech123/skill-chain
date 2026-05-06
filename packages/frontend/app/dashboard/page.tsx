"use client";
import { signOut } from "next-auth/react";
import { useDisconnect } from "wagmi";
export default function DashboardPage() {
  const { disconnect } = useDisconnect();

  const handleSignOut = () => {
    document.cookie = "wallet_connected=; path=/; max-age=0";
    disconnect();
    signOut({ callbackUrl: "/" });
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  );
}
