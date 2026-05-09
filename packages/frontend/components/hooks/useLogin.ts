import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import { BACKEND_URL, CONTRACT_ADDRESSES, ProofVerifier } from "@my-app/shared";

type Status = "idle" | "pending" | "success" | "already_claimed" | "error";

export function useLogin() {
  const { data: session } = useSession();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { writeContractAsync } = useWriteContract();
  const hasRun = useRef(false);

  const githubConnected = !!session?.user?.githubConnected;
  const allDone = isConnected && githubConnected;

  useEffect(() => {
    if (!session?.user?.id || !address) return;

    if (!githubConnected) return;
    // only run once
    if (hasRun.current) return;

    async function claimFirstLogin() {
      hasRun.current = true;

      try {
        const res = await fetch(`${BACKEND_URL}/api/sign-proof`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userAddress: address,
            achievementId: "first_login",
            userId: session!.user.id,
          }),
        });

        if (res.status === 409) {
          console.log("First login already claimed");
          return;
        }
        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error);
        }

        const { achievementHash, timestamp, signature } = await res.json();

        const contractAddress = CONTRACT_ADDRESSES[chainId].contract;
        if (!contractAddress) throw new Error("Unsupported chain");

        await writeContractAsync({
          address: contractAddress as `0x${string}`,
          abi: ProofVerifier,
          functionName: "submitProof",
          args: [
            achievementHash as `0x${string}`,
            BigInt(timestamp),
            signature as `0x${string}`,
          ],
        });

        console.log("First login achievement claimed");
      } catch (e) {
        console.error("Failed to claim first login:", e);
        hasRun.current = false;
      }
    }

    claimFirstLogin();
  }, [session, address, githubConnected, chainId]);
  return { allDone, isConnected, githubConnected };
}
