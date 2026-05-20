import { NftMetadata } from "@my-app/shared";
import { useEffect, useState } from "react";

export function useNftMetadata(tokenURI: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<NftMetadata | null>(null);
  useEffect(() => {
    if (!tokenURI) return;

    async function fetchMetadata() {
      setLoading(true);
      setError(null);
      try {
        const metadataUrl = tokenURI.startsWith("ipfs://")
          ? tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
          : tokenURI;

        const res = await fetch(metadataUrl);
        if (!res.ok) throw new Error("Failed to fetch metadata");

        const data: NftMetadata = await res.json();
        data.image = data.image.replace(
          "ipfs://",
          "https://cloudflare-ipfs.com/ipfs/",
        );

        setMetadata(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchMetadata();
  }, [tokenURI]);
  return { metadata, loading, error };
}
