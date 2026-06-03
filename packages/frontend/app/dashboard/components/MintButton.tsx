// frontend/app/dashboard/components/MintButton.tsx
"use client";
import { useState } from "react";
import {
  BACKEND_URL,
  CONTRACT_ADDRESSES,
  DeveloperStats,
  MintResult,
  PendingMint,
  SoulboundNft,
} from "@my-app/shared";
import { useAccount, useWriteContract } from "wagmi";
import { useSession } from "next-auth/react";

interface Props {
  stats: DeveloperStats;
  pendingMints: PendingMint[];
  userId: string;
}

export function MintButton({ stats, pendingMints, userId }: Props) {
  const { data: session, status: sessionStatus } = useSession();

  const [minting, setMinting] = useState(false);
  const [results, setResults] = useState<MintResult[]>([]);
  const [currentMinting, setCurrentMinting] = useState<string | null>(null);
  const { writeContractAsync } = useWriteContract();
  const { address, chain } = useAccount();
  const chainId = chain?.id;

  async function handleMint() {
    if (!session?.user.accessToken) return;
    if (pendingMints.length === 0) return;

    setMinting(true);
    setResults([]);

    for (const pending of pendingMints) {
      setCurrentMinting(pending.title ?? pending.achievementId);

      try {
        const res = await fetch(`${BACKEND_URL}/api/mint`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.user.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stats,
            achievementId: pending.achievementId,
            address,
            chainId,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        const { metadataUri, txHash } = data;

        const markRes = await fetch(`${BACKEND_URL}/api/mark-minted`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.user.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            achievementId: pending.achievementId,
            walletAddress: address,
            txHash: txHash,
          }),
        });

        if (!markRes.ok) throw new Error("Failed to mark as minted");

        setResults((prev) => [
          ...prev,
          {
            achievementId: pending.achievementId,
            name: pending.title ?? pending.achievementId,
            txHash: "",
            status: "done",
          },
        ]);
      } catch (e) {
        setResults((prev) => [
          ...prev,
          {
            achievementId: pending.achievementId,
            name: pending.title ?? pending.achievementId,
            txHash: "",
            status: "error",
          },
        ]);
      }
    }
    setCurrentMinting(null);
    setMinting(false);
  }

  if (pendingMints.length === 0) {
    return (
      <p className="text-sm text-gray-400">No achievements ready to mint.</p>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {/* Pending list */}
      <p>{}</p>
      {results.length === 0 && !minting && (
        <div className="flex flex-wrap gap-2">
          {pendingMints.map((p) => (
            <span
              key={p.achievementId}
              className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full"
            >
              {p.title ?? p.achievementId}
            </span>
          ))}
        </div>
      )}

      {/* Mint button */}
      {!minting && results.length === 0 && (
        <button
          onClick={handleMint}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Mint {pendingMints.length} Achievement
          {pendingMints.length > 1 ? "s" : ""}
        </button>
      )}

      {/* Currently minting indicator */}
      {minting && currentMinting && (
        <p className="text-sm text-gray-500 animate-pulse">
          Minting {currentMinting}...
        </p>
      )}

      {/* Per-achievement results */}
      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((result) => (
            <div key={result.achievementId}>
              {result.status === "done" ? (
                <p className="text-sm text-green-600">
                  {result.name} minted —{" "}
                  <a
                    href={`https://etherscan.io/tx/${result.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    View on Etherscan {result.txHash}
                  </a>
                </p>
              ) : (
                <p className="text-sm text-red-500">
                  ❌ {result.name} failed — try again
                </p>
              )}
            </div>
          ))}

          {/* Retry button if any failed */}
          {results.some((r) => r.status === "error") && (
            <button
              onClick={handleMint}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
            >
              Retry failed mints
            </button>
          )}
        </div>
      )}
    </div>
  );
}
