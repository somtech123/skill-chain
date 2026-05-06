import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { buildIndex, computeStates } from "@my-app/indexer";
import { IndexedRepo } from "@my-app/shared";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { MintButton } from "./MintButton";

export async function RepoList() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.accessToken) {
    redirect("/");
  }

  const repos: IndexedRepo[] = await buildIndex(session.user.accessToken);
  const stats = computeStates(repos);

  return (
    <div className="space-y-8">
      {/* Developer Stats Card */}
      <div className="p-6 rounded-xl border border-gray-200 bg-gray-50">
        <h2 className="text-lg font-bold mb-4">Your Developer Stats</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-indigo-600">
              {stats.totalRepos}
            </p>
            <p className="text-sm text-gray-500">Repositories</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-indigo-600">
              {stats.totalCommits}
            </p>
            <p className="text-sm text-gray-500">Commits</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-indigo-600">{stats.score}</p>
            <p className="text-sm text-gray-500">Score</p>
          </div>
        </div>

        {/* Top Languages */}
        <div className="flex gap-2 flex-wrap">
          {stats.topLanguages.map(({ language, count }) => (
            <span
              key={language}
              className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700"
            >
              {language} ({count})
            </span>
          ))}
        </div>

        {/* Mint Button — passes stats to client component */}
        <MintButton stats={stats} />
      </div>

      {/* Repo List */}
      <div className="space-y-4">
        {repos.map((repo) => (
          <div key={repo.id} className="p-4 rounded-lg border border-gray-200">
            <h2 className="font-semibold text-gray-900">{repo.fullName}</h2>
            <p className="text-sm text-gray-500 mb-2">{repo.description}</p>
            <div className="flex gap-4 text-xs text-gray-400">
              <span>{repo.language}</span>
              <span>⭐ {repo.stars}</span>
              <span>{repo.commits.length} commits</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
