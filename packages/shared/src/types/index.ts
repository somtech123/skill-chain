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
