import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import {
  BACKEND_URL,
  CONTRACT_ADDRESSES,
  ProofVerifier,
  SignProofResponse,
  Status,
} from "@my-app/shared";

export function useLogin() {
  const [status, setStatus] = useState<Status>("idle");

  const { data: session, status: sessionStatus } = useSession();
  const { address, isConnected, chain } = useAccount();
  const chainId = chain?.id;
  const { writeContractAsync } = useWriteContract();
  const hasRun = useRef(false);

  const githubConnected = !!session?.user?.githubConnected;
  const allDone = isConnected && githubConnected;

  useEffect(() => {
    hasRun.current = false;
    setStatus("idle");
  }, [address]);

  useEffect(() => {
    console.log("1. effect fired", {
      status,
      sessionId: session?.user?.id,
      address,
      githubConnected,
      hasRun: hasRun.current,
    });
    if (sessionStatus === "loading") return;

    if (!session?.user?.id || !address || !githubConnected) {
      return;
    }
    if (hasRun.current) {
      return;
    }

    console.log("3. calling claimFirstLogin");

    async function claimFirstLogin() {
      hasRun.current = true;

      try {
        setStatus("pending");

        const res = await fetch(`${BACKEND_URL}/api/sign-proof`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userAddress: address,
            achievementId: "first_login",
            userId: session!.user.id,
          }),
        });

        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error);
        }

        const data: SignProofResponse = await res.json();
        console.log(data);
        //already claimed
        if (data.alreadyClaimed) {
          setStatus("already_claimed");
          return;
        }

        const { achievementHash, timestamp, signature } = data;

        const contractAddress = CONTRACT_ADDRESSES[chainId!]?.contract;
        if (!contractAddress) {
          throw new Error(`No contract address for chain ${chainId}`);
        }

        // step 2 — submit tx on-chain
        let txHash: string;
        try {
          txHash = await writeContractAsync({
            address: contractAddress as `0x${string}`,
            abi: ProofVerifier,
            functionName: "submitProof",
            args: [
              achievementHash as `0x${string}`,
              BigInt(timestamp!),
              signature as `0x${string}`,
            ],
          });
        } catch (e: any) {
          setStatus("idle");
          hasRun.current = false; // allow retry
          return; // ← stay on landing page
        }

        // step 3 — confirm with backend after tx succeeds
        const confirmRes = await fetch(`${BACKEND_URL}/api/confirm-proof`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userAddress: address,
            achievementId: "first_login",
            userId: session!.user.id,
            txHash,
          }),
        });
        if (!confirmRes.ok) {
          throw new Error("Failed to confirm proof");
        }

        setStatus("success");
      } catch (e) {
        setStatus("error");
        hasRun.current = false;
      }
    }

    claimFirstLogin();
  }, [session, address, githubConnected, chainId]);

  return { allDone, isConnected, githubConnected, status, sessionStatus };
}
