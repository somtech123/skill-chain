interface ContractsConfig {
  [chainId: number]: {
    contract: string;
    no_check: string | null;
  };
}

export const CONTRACT_ADDRESSES: ContractsConfig = {
  11155111: {
    contract: "0x0E8C14B3f77540feFafA87a9c6406894E30fB9Cb",
    no_check: "0x0E8C14B3f77540feFafA87a9c6406894E30fB9Cb",
  },
  31337: {
    contract: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
    no_check: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
  },
};
