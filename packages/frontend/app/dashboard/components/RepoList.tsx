import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { buildIndex, computeStates } from "@my-app/indexer";
import { IndexedRepo } from "@my-app/shared";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { MintButton } from "./MintButton";
import NftCard from "./NftCard";

export async function RepoList() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.accessToken) {
    redirect("/");
  }

  const repos: IndexedRepo[] = await buildIndex(session.user.accessToken);
  const stats = computeStates(repos);

  const mintedNfts = [
    {
      id: 1,
      txHash: "0xabc123def456",
      score: 820,
      repos: 38,
      commits: 1100,
      contractAddress: "0x1234abcd5678ef",
      mintedAt: "2024-01-15",
    },
    {
      id: 2,
      txHash: "0xdef789abc012",
      score: 640,
      repos: 28,
      commits: 800,
      contractAddress: "0x1234abcd5678ef",
      mintedAt: "2024-03-20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Developer Stats Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Repositories", value: stats.totalRepos },
          { label: "Total commits", value: stats.totalCommits },
          { label: "Dev score", value: stats.score },
          { label: "Languages", value: stats.topLanguages.length },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-gray-50 rounded-lg p-4 border border-base bg-surface"
          >
            <p className=" text-secondary mb-1">{label}</p>
            <p className="text-3xl font-bold text-accent">
              {value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Top languages */}
      <div className="border border-base rounded-xl p-4 space-y-3">
        <p className="text-sm text-secondary">Top languages</p>

        <div className="flex flex-wrap gap-2">
          {stats.topLanguages.map(({ language, count }) => (
            <span
              key={language}
              className="text-xs bg-indigo-50 text-accent px-3 py-1 rounded-full"
            >
              {language} {count}
            </span>
          ))}
        </div>
        {stats.topLanguages.map(({ language, count }) => {
          const pct = Math.round((count / stats.totalRepos) * 100);
          return (
            <div key={language} className="flex items-center gap-3">
              <span className="text-xs text-primary w-24">{language}</span>
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-gray-400">{pct}%</span>
            </div>
          );
        })}
      </div>

      {/* NFT badge + mint */}
      <div className="border rounded-xl p-4 flex gap-6 items-center flex-wrap">
        <div className="w-28 h-28 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
          {/* swap with real NFT image once minted */}
          <svg width="64" height="64" viewBox="0 0 72 72" fill="none">
            <polygon
              points="36,4 66,20 66,52 36,68 6,52 6,20"
              fill="#EEEDFE"
              stroke="#7F77DD"
              strokeWidth="2"
            />
            <text
              x="36"
              y="34"
              textAnchor="middle"
              fontSize="10"
              fontWeight="500"
              fill="#3C3489"
            >
              DEV
            </text>
            <text x="36" y="46" textAnchor="middle" fontSize="8" fill="#534AB7">
              {stats.score} pts
            </text>
          </svg>
        </div>
        <div className="flex-1">
          <p className="font-medium mb-1">Developer NFT</p>
          <p className="text-sm text-gray-500 mb-3">
            {stats.totalRepos} repos · {stats.totalCommits.toLocaleString()}{" "}
            commits · score {stats.score}
          </p>
          <MintButton stats={stats} />
        </div>
      </div>

      {/* Minted NFTs */}
      <div>
        <p className="font-medium mb-1 text-primary">
          Minted NFTs{" "}
          <span className="text-sm font-normal text-secondary">
            ({mintedNfts.length})
          </span>
        </p>
        <p className="text-xs text-gray-400 mb-3">
          Click any card to view on OpenSea, Rarible, or inspect metadata
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {mintedNfts.map((nft) => (
            <NftCard key={nft.id} {...nft} />
          ))}
        </div>
      </div>

      {/* Repo List
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
      </div> */}
    </div>
  );
}
