"use client";
import { useUserNft } from "../hooks/useUserNft";
import NftCard from "./NftCard";

export default function MintedNft() {
  const { nfts, loading, error } = useUserNft();
  if (loading) return <p className="text-sm text-gray-400">Loading NFTs...</p>;
  if (error) return <p className="text-sm text-red-400">{error}</p>;
  if (!nfts.length)
    return <p className="text-sm text-gray-400">No NFTs minted yet.</p>;

  return (
    <div>
      <p className="font-medium mb-1 text-primary">
        Minted NFTs{" "}
        <span className="text-sm font-normal text-secondary">
          ({nfts.length})
        </span>
      </p>
      <p className="text-xs text-gray-400 mb-3">
        Click any card to view on OpenSea, Etherscan, or inspect metadata
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {nfts.map((nft) => (
          <NftCard key={nft.id} {...nft} />
        ))}
      </div>
    </div>
  );
}
