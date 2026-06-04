export const config = {
  dev: {
    BACKEND_URL: "http://localhost:3002",
    FRONTEND_URL: "http://localhost:3000",
  },
  prod: {
    BACKEND_URL: "https://my-appbackend-production.up.railway.app",
    FRONTEND_URL: "",
  },
};

const isProd = process.env.NODE_ENV === "production";

export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  process.env.BACKEND_URL ??
  (isProd ? config.prod.BACKEND_URL : config.dev.BACKEND_URL);

export const FRONTEND_URL =
  process.env.FRONTEND_URL ??
  (isProd ? config.prod.FRONTEND_URL : config.dev.FRONTEND_URL);

export const RPC_URLS: Record<number, string> = {
  11155111: process.env.SEPOLIA_RPC_URL!, // Sepolia
};
