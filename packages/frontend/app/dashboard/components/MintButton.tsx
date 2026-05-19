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

interface Props {
  stats: DeveloperStats;
  pendingMints: PendingMint[];
  userId: string;
}

export function MintButton({ stats, pendingMints, userId }: Props) {
  const [minting, setMinting] = useState(false);
  const [results, setResults] = useState<MintResult[]>([]);
  const [currentMinting, setCurrentMinting] = useState<string | null>(null);
  const { writeContractAsync } = useWriteContract();
  const { address, chain } = useAccount();
  const chainId = chain?.id;

  async function handleMint() {
    if (pendingMints.length === 0) return;
    console.log(pendingMints.length);
    console.log("Fetching:", `${BACKEND_URL}/api/mint`);
    setMinting(true);
    setResults([]);

    for (const pending of pendingMints) {
      console.log("minting pending:", pending);
      setCurrentMinting(pending.title ?? pending.achievementId);

      try {
        const res = await fetch(`${BACKEND_URL}/api/mint`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stats,
            achievementId: pending.achievementId,
            userId,
            address,
            chainId,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        const { metadataUri, achievementHash } = data;

        // if (!address) return;

        // let txHash: string;
        // try {
        //   txHash = await writeContractAsync({
        //     address: contractAddress as `0x${string}`,
        //     abi: SoulboundNft,
        //     functionName: "issue",
        //     args: [address, metadataUri, achievementHash],
        //   });
        // } catch (e) {
        //   throw new Error(e instanceof Error ? e.message : String(e));
        // }
        // console.log("return", {
        //   metadataUri,
        //   achievementHash,
        // });

        const markRes = await fetch(`${BACKEND_URL}/api/mark-minted`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: data.userId,
            achievementId: pending.achievementId,
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

  // return (
  //   <div className="mt-4">
  //     {status === "idle" && (
  //       <button
  //         onClick={handleMint}
  //         className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
  //       >
  //         Mint Developer NFT
  //       </button>
  //     )}
  //     {status === "minting" && (
  //       <p className="text-sm text-gray-500">Minting your NFT...</p>
  //     )}
  //     {status === "done" && (
  //       <p className="text-sm text-green-600">
  //         ✅ Minted! href={`https://etherscan.io/tx/}`}
  //         target="_blank" className="underline" View on Etherscan
  //       </p>
  //     )}
  //     {status === "error" && (
  //       <p className="text-sm text-red-500">❌ Minting failed. Try again.</p>
  //     )}
  //   </div>
  // );
}
