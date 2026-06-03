import { IPFS_GATEWAYS, NftMetadata } from "@my-app/shared";
import { useEffect, useState } from "react";

function resolveIpfsUrl(url: string, gatewayIndex = 0): string {
  const gateway = IPFS_GATEWAYS[gatewayIndex];
  return url.startsWith("ipfs://") ? url.replace("ipfs://", gateway) : url;
}

export function useNftMetadata(tokenURI: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<NftMetadata | null>(null);

  useEffect(() => {
    if (!tokenURI) return;

    async function fetchWithFallback(
      url: string,
      gatewayIndex = 0,
    ): Promise<Response> {
      try {
        const res = await fetch(resolveIpfsUrl(url, gatewayIndex));
        if (!res.ok) throw new Error("Bad response");
        return res;
      } catch (e) {
        if (gatewayIndex + 1 < IPFS_GATEWAYS.length) {
          return fetchWithFallback(url, gatewayIndex + 1);
        }
        throw new Error("All IPFS gateways failed");
      }
    }

    async function fetchMetadata() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchWithFallback(tokenURI);
        const data: NftMetadata = await res.json();

        // Resolve image URL with same gateway fallback logic
        data.image = resolveIpfsUrl(data.image);

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
