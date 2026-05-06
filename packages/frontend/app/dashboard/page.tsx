// "use client";
import { signOut } from "next-auth/react";
import { Suspense } from "react";
import { useDisconnect } from "wagmi";
import { RepoSkeleton } from "./components/RepoSkeleton";
import { RepoList } from "./components/RepoList";
export default function DashboardPage() {
  // const { disconnect } = useDisconnect();

  // const handleSignOut = () => {
  //   document.cookie = "wallet_connected=; path=/; max-age=0";
  //   disconnect();
  //   signOut({ callbackUrl: "/" });
  // };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Repositories</h1>

      {/* Suspense shows RepoSkeleton until RepoList finishes fetching */}
      <Suspense fallback={<RepoSkeleton />}>
        <RepoList />
      </Suspense>
    </div>
  );
}
