import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const RPC_URLS: Record<number, string> = {
  11155111: process.env.SEPOLIA_RPC_URL!, // Sepolia
};
