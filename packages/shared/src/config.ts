export const config = {
  dev: {
    BACKEND_URL: "http://localhost:3002",
    FRONTEND_URL: "http://localhost:3000",
  },
  prod: { BACKEND_URL: "", FRONTEND_URL: "" },
};

export const BACKEND_URL = process.env.BACKEND_URL ?? config.dev.BACKEND_URL;

export const RPC_URLS: Record<number, string> = {
  11155111: process.env.SEPOLIA_RPC_URL!, // Sepolia
};
