import { Suspense } from "react";
import { RepoSkeleton } from "./components/RepoSkeleton";
import { RepoList } from "./components/RepoList";
import { Achievement } from "./components/Achievement";
export default function DashboardPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Repositories</h1>

      {/* Suspense shows RepoSkeleton until RepoList finishes fetching */}
      <Suspense fallback={<RepoSkeleton />}>
        <RepoList />
      </Suspense>
      <Achievement />
    </div>
  );
}
