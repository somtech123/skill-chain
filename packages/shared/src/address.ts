interface ContractsConfig {
  [chainId: number]: {
    contract: string;
    no_check: string | null;
  };
}

export const CONTRACT_ADDRESSES: ContractsConfig = {
  11155111: {
    contract: "0xCCfd9ea09Ea2b5AaDf3cefF09E972Deb714e4Cb1",
    no_check: "0xCCfd9ea09Ea2b5AaDf3cefF09E972Deb714e4Cb1",
  },
};
