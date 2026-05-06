// frontend/app/dashboard/components/MintButton.tsx
"use client";
import { useState } from "react";
import { DeveloperStats } from "@my-app/shared";

interface Props {
  stats: DeveloperStats;
}

export function MintButton({ stats }: Props) {
  const [status, setStatus] = useState<"idle" | "minting" | "done" | "error">(
    "idle",
  );
  const [txHash, setTxHash] = useState<string | null>(null);

  async function handleMint() {
    setStatus("minting");
    try {
      const res = await fetch("/api/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stats }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setTxHash(data.txHash);
      setStatus("done");
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <div className="mt-4">
      {status === "idle" && (
        <button
          onClick={handleMint}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Mint Developer NFT
        </button>
      )}
      {status === "minting" && (
        <p className="text-sm text-gray-500">Minting your NFT...</p>
      )}
      {status === "done" && (
        <p className="text-sm text-green-600">
          ✅ Minted! href={`https://etherscan.io/tx/${txHash}`}
          target="_blank" className="underline" View on Etherscan
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-500">❌ Minting failed. Try again.</p>
      )}
    </div>
  );
}
