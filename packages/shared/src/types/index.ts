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

export interface Achievement {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  wallet_address: string;
  achievement_id: string;
  minted: boolean;
  claimed_at: string | null;
  tx_hash: string | null;
  achievements: Achievement | null;
}

export interface AchievementStatus extends Achievement {
  earned: boolean;
  minted: boolean;
  claimed_at: string | null;
  tx_hash: string | null;
}

export interface PendingMint {
  userAchievementId: string;
  achievementId: string;
  title: string | undefined;
  claimed_at: string | null;
}

export interface UserAchievementsResponse {
  success: boolean;
  achievementStatus: AchievementStatus[];
  pendingMints: PendingMint[];
  minted: UserAchievement[];
  nextAchievement: Achievement | null;
}

export interface ConfirmProofBody {
  userAddress: string;
  achievementId: string;
  userId: string;
  txHash: string;
}

export interface MarkMintedBody {
  userId: string;
  achievementId: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: { trait_type: string; value: string | number }[];
}

export interface MintResult {
  achievementId: string;
  name: string;
  txHash: string;
  status: "done" | "error";
}
