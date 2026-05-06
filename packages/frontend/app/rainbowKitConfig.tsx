"use client";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { Config } from "wagmi";
import { sepolia } from "wagmi/chains";

const config: Config = getDefaultConfig({
  appName: "Skill Chain",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [sepolia],
  ssr: false,
});

export default config;
