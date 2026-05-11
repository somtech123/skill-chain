export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  isPrivate: boolean;
  language: string | null;
  stars: number;
  updatedAt: string;
}

export interface Commit {
  oid: string;
  message: string;
  committedDate: string;
  author: {
    name: string;
    email: string;
  };
}

export interface IndexedRepo extends Repository {
  commits: Commit[];
  indexedAt: string;
}

export interface DeveloperStats {
  totalRepos: number;
  totalCommits: number;
  topLanguages: { language: string; count: number }[];
  score: number;
}

export interface MintedNFT {
  id: number;
  txHash: string;
  score: number;
  repos: number;
  commits: number;
  contractAddress: string;
  mintedAt: string;
}

export type Status =
  | "idle"
  | "pending"
  | "success"
  | "already_claimed"
  | "error";

export type SignProofResponse = {
  alreadyClaimed: boolean;
  achievementName: string;
  achievementHash?: string;
  timestamp?: number;
  signature?: string;
};
