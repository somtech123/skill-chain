interface ChainContracts {
  proofVerifier: string;
  soulboundNft: string;
}

interface ContractsConfig {
  [chainId: number]: ChainContracts;
}
export const CONTRACT_ADDRESSES: ContractsConfig = {
  31337: {
    proofVerifier: "0x2279b7a0a67db372996a5fab50d91eaa73d2ebe6",
    soulboundNft: "0x8a791620dd6260079bf849dc5567adc3f2fdc318",
  },

  11155111: {
    proofVerifier: "0xfa4ecd7e60a06567c5d16e7fcb05c46f479d0451",
    soulboundNft: "0xb22f6d60c49f325813185c77b8a5b3b23eb130e6",
  },
};
