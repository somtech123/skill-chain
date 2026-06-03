import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { buildIndex, computeStates } from "@my-app/indexer";
import {
  BACKEND_URL,
  IndexedRepo,
  UserAchievementsResponse,
} from "@my-app/shared";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { MintButton } from "./MintButton";

import { UserData } from "../hooks/useUserProofs";
import MintedNft from "./MintedNft";
import { AutoClaimTrigger } from "./AutoClaimTrigger";

type Props = {
  data: UserData | null;
  userLoading: boolean;
};

export async function RepoList() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.accessToken) {
    redirect("/");
  }

  const repos: IndexedRepo[] = await buildIndex(session.user.accessToken);
  const stats = computeStates(repos);
  const userId = session.user.id;

  let achievementsData: UserAchievementsResponse = {
    success: true,
    achievementStatus: [],
    pendingMints: [],
    minted: [],
    nextAchievement: null,
  };

  try {
    const res = await fetch(
      `${BACKEND_URL}/api/user-achievements/${userId}?totalRepos=${stats.totalRepos}&totalCommits=${stats.totalCommits}&score=${stats.score}`,
      {
        headers: {
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
        cache: "no-store",
      },
    );
    if (!res.ok) {
      console.error(
        "Failed to fetch achievements:",
        res.status,
        res.statusText,
      );
    } else {
      const json = await res.json();
      achievementsData = json;
    }
  } catch (err) {
    console.error("Achievements fetch error:", err);
  }

  let justClaimed = false;

  if (achievementsData.nextAchievement?.reached) {
    try {
      const claimRes = await fetch(`${BACKEND_URL}/api/claim-achievement`, {
        method: "POST",

        headers: {
          Authorization: `Bearer ${session?.user.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          achievementId: achievementsData.nextAchievement.id,
        }),
      });
      const claimData = await claimRes.json();
      if (claimRes.ok && !claimData.alreadyClaimed) {
        justClaimed = true;

        const refetch = await fetch(
          `${BACKEND_URL}/api/user-achievements/${userId}?totalRepos=${stats.totalRepos}&totalCommits=${stats.totalCommits}&score=${stats.score}`,
          {
            headers: {
              Authorization: `Bearer ${session?.user.accessToken}`,
            },
            cache: "no-store",
          },
        );
        if (refetch.ok) {
          achievementsData = await refetch.json();
        }
      }
    } catch (err) {
      console.error("Auto-claim error:", err);
    }
  }

  const { pendingMints, nextAchievement } = achievementsData;

  return (
    <div className="space-y-8">
      {/*triggers refresh if just claimed */}
      <AutoClaimTrigger claimed={justClaimed} />
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
      {nextAchievement && (
        <div className="border border-base rounded-xl p-4">
          <p className="text-sm text-secondary mb-1">Next achievement</p>
          <p className="font-medium text-primary">{nextAchievement.name}</p>
          <p className="text-sm text-gray-500">{nextAchievement.description}</p>

          {nextAchievement!.criteria?.minRepos && (
            <div>
              <div className="flex justify-between text-xs text-secondary mb-1">
                <span>Repos</span>
                <span>
                  {stats.totalRepos} / {nextAchievement!.criteria.minRepos}
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{
                    width: `${Math.min((stats.totalRepos / nextAchievement!.criteria.minRepos) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          {nextAchievement!.criteria?.minCommits && (
            <div>
              <div className="flex justify-between text-xs text-secondary mb-1">
                <span>Commits</span>
                <span>
                  {stats.totalCommits} / {nextAchievement!.criteria.minCommits}
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{
                    width: `${Math.min((stats.totalCommits / nextAchievement!.criteria.minCommits) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          {nextAchievement!.criteria?.minScore && (
            <div>
              <div className="flex justify-between text-xs text-secondary mb-1">
                <span>Score</span>
                <span>
                  {stats.score} / {nextAchievement!.criteria.minScore}
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{
                    width: `${Math.min((stats.score / nextAchievement!.criteria.minScore) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          {nextAchievement.reached && (
            <p className="text-xs text-green-500 font-medium">
              🎉 Achievement reached — ready to mint below
            </p>
          )}
        </div>
      )}

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
        <div className="w-28 h-28 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
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
          <MintButton
            stats={stats}
            pendingMints={pendingMints}
            userId={userId}
          />
        </div>
      </div>

      {/* Minted NFTs */}
      <MintedNft />
    </div>
  );
}
