"use client";

import { BACKEND_URL, GET_USER_PROOFS, GRAPH_URL } from "@my-app/shared";
import { useCallback, useEffect, useState } from "react";

type Proof = {
  id: string;
  achievementHash: string;
  achievementName: string;
  achievementDescription: string;
  blockTimestamp: string;
  blockNumber: string;
  transactionHash: string;
};

export type UserData = {
  id: string;
  totalProofs: string;
  firstSeenAt: string;
  lastSeenAt: string;
  proofs: Proof[];
};
const PAGE_SIZE = 1000;

export function useUserProofs(address?: string) {
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProofs = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    setError(null);

    try {
      // fetch proof from the graph
      const res = await fetch(GRAPH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: GET_USER_PROOFS,
          variables: { address: address.toLowerCase() },
        }),
      });

      const json = await res.json();
      if (json.errors) throw new Error(json.errors[0].message);

      const user = json.data.user;
      if (!user) {
        setData(null);
        return;
      }

      // fetch achievement names from backend for each proof

      const proofWithNames = await Promise.all(
        user.proofs.map(async (proof: any) => {
          try {
            const nameRes = await fetch(
              `${BACKEND_URL}/api/achievement-by-hash/${proof.achievementHash}`,
            );
            if (!nameRes.ok) {
              return {
                ...proof,
                achievementName: "Unknown Achievement",
                achievementDescription: "",
              };
            }

            const { name, description } = await nameRes.json();
            return {
              ...proof,
              achievementName: name,
              achievementDescription: description,
            };
          } catch (e) {
            return {
              ...proof,
              achievementName: "Unknown Achievement",
              achievementDescription: "",
            };
          }
        }),
      );
      setData({ ...user, proofs: proofWithNames });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchUserProofs();
  }, [fetchUserProofs]);

  return { data, loading, error };
}
