"use client";
import { IPFS_GATEWAYS, UserNft } from "@my-app/shared";
import { useState } from "react";
import { useNftMetadata } from "../hooks/useNftMetadata";
import { NftDetailModal } from "./NftDetailModal";

export default function NFTCard({
  id,
  tokenId,
  tokenURI,
  achievement,
  revoked,
  blockTimestamp,
  txHash,
}: UserNft) {
  const { metadata, loading, error } = useNftMetadata(tokenURI);
  const shortTx = `${txHash.slice(0, 6)}...${txHash.slice(-4)}`;

  const [pressed, setPressed] = useState(false);
  const [open, setOpen] = useState(false);

  function handleClick() {
    setPressed(true);
    setTimeout(() => {
      setPressed(false);
      setOpen(true);
    }, 150);
  }
  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
        className={`border rounded-xl overflow-hidden cursor-pointer select-none transition-all duration-150 ${
          pressed
            ? "scale-95 border-indigo-500 bg-indigo-50"
            : "hover:border-indigo-200 hover:bg-blue-500"
        }`}
      >
        {loading ? (
          <div className="w-full h-36 bg-gray-100 animate-pulse" />
        ) : error ? (
          <div className="w-full h-36 bg-red-50 flex items-center justify-center">
            <span className="text-xs text-red-400">Failed to load</span>
          </div>
        ) : metadata ? (
          <img
            src={metadata?.image}
            alt={achievement}
            className="w-full h-36 object-cover"
            onError={(e) => {
              const img = e.currentTarget;
              const currentsrc = img.src;
              const currentGetWayIndex = IPFS_GATEWAYS.findIndex((g) =>
                currentsrc.includes(g),
              );

              const nextIndex = currentGetWayIndex + 1;
              if (nextIndex < IPFS_GATEWAYS.length && metadata?.image) {
                img.src = metadata.image.startsWith("ipfs://")
                  ? metadata.image.replace("ipfs://", IPFS_GATEWAYS[nextIndex])
                  : metadata.image.replace(
                      IPFS_GATEWAYS[currentGetWayIndex],
                      IPFS_GATEWAYS[nextIndex],
                    );
              }
            }}
          />
        ) : (
          <div className="w-full h-36 bg-indigo-50 flex items-center justify-center">
            <span className="text-xs text-gray-400">No image</span>
          </div>
        )}

        {/* Info */}
        <div className="p-3 space-y-1">
          <p className="text-sm font-medium text-primary">TokenId #{tokenId}</p>

          <a
            href={`https://etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-500 hover:underline"
          >
            {shortTx}
          </a>
        </div>
      </div>

      {/* Modal */}
      {open && metadata && (
        <NftDetailModal
          metadata={metadata}
          tokenId={tokenId}
          txHash={txHash}
          blockTimestamp={blockTimestamp}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
