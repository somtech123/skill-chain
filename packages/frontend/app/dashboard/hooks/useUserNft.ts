import { GET_USERS_NFTs, GRAPH_URL } from "@my-app/shared";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export function useUserNft() {
  const { address } = useAccount();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) return;

    async function fetchNfts() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(GRAPH_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: GET_USERS_NFTs,
            variables: { owner: (address as string).toLowerCase() },
          }),
        });

        if (!res.ok) throw new Error("Failed to fetch NFTs");

        const { data, errors } = await res.json();

        // GraphQL errors come in the body, not as HTTP errors
        if (errors?.length) throw new Error(errors[0].message);

        setNfts(data?.user?.nfts ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchNfts();
  }, [address]);

  return { nfts, loading, error };
}
