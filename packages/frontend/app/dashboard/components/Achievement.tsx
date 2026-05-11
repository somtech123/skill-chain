"use client";

import { useAccount } from "wagmi";
import { useUserProofs } from "../hooks/useUserProofs";

export function Achievement() {
  const { address } = useAccount();
  const { data, loading, error } = useUserProofs(address);

  if (loading) return <p>Loading achievements...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No achievements yet.</p>;

  return (
    <div className="space-y-4 mb-2 mt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold mb-2">Achievements</h2>
        <span className="text-sm text-secondary">{data.totalProofs} total</span>
      </div>

      <div className="space-y-3">
        {data.proofs.map((proof) => (
          <div
            key={proof.id}
            className="flex items-center justify-between p-3 rounded-xl border border-base bg-surface"
          >
            <div>
              <p className="text-sm font-medium text-primary">
                {proof.achievementName}
              </p>
              <p className="text-xs text-secondary">
                {proof.achievementDescription}
              </p>
              <p className="text-xs text-secondary">
                {new Date(
                  Number(proof.blockTimestamp) * 1000,
                ).toLocaleDateString()}
              </p>
            </div>
            <a
              href={`https://sepolia.etherscan.io/tx/${proof.transactionHash}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-accent
              hover:underline"
            >
              {" "}
              View ↗
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
