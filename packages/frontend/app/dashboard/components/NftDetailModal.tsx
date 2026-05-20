import { NftMetadata } from "@my-app/shared";

type Props = {
  metadata: NftMetadata;
  tokenId: string;
  txHash: string;
  blockTimestamp: string;
  onClose: () => void;
};

export function NftDetailModal({
  metadata,
  tokenId,
  txHash,
  blockTimestamp,
  onClose,
}: Props) {
  const date = new Date(Number(blockTimestamp) * 1000).toLocaleDateString();
  const shortTx = `${txHash.slice(0, 6)}...${txHash.slice(-4)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl w-full max-w-md overflow-hidden shadow-xl  max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative shrink-0">
          <img
            src={metadata.image}
            alt={metadata.name}
            className="w-full h-56 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Title */}
          <div>
            <p className="text-xs text-secondary mb-0.5">#{tokenId}</p>
            <h2 className="text-lg font-semibold text-primary">
              {metadata.name}
            </h2>
            <p className="text-sm text-secondary mt-1">
              {metadata.description}
            </p>
          </div>

          {/* Attributes */}
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase mb-2">
              Properties
            </p>
            <div className="grid grid-cols-2 gap-2">
              {metadata.attributes.map((attr) => (
                <div
                  key={attr.trait_type}
                  className="bg-indigo-50 border border-indigo-100 rounded-lg p-2 text-center"
                >
                  <p className="text-xs text-indigo-400 uppercase">
                    {attr.trait_type}
                  </p>
                  <p className="text-sm font-semibold text-indigo-700">
                    {attr.value.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Chain info */}
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase mb-2">
              Details
            </p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Minted</span>
                <span className="text-primary">{date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Transaction</span>

                <a
                  href={`https://etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-500 hover:underline"
                >
                  {shortTx}
                </a>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <a
              href={`https://opensea.io/assets/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-sm border border-base rounded-lg py-2 hover:bg-gray-50 hover:text-hover"
            >
              View on OpenSea
            </a>

            <a
              href={`https://etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-sm border border-base rounded-lg py-2 hover:bg-gray-50 hover:text-hover"
            >
              Etherscan
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
