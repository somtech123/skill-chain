import { DeveloperStats, IndexedRepo } from "@my-app/shared";

export function computeStates(repos: IndexedRepo[]): DeveloperStats {
  const totalRepos = repos.length;

  const totalCommits = repos.reduce((sum, r) => sum + r.commits.length, 0);

  const langMap: Record<string, number> = {};
  for (const repo of repos) {
    if (repo.language) {
      langMap[repo.language] = (langMap[repo.language] ?? 0) + 1;
    }
  }

  const topLanguages = Object.entries(langMap)
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Simple score: repos * 10 + commits * 2 + languages * 5
  const score = totalRepos * 10 + totalCommits * 2 + topLanguages.length * 5;

  return { totalRepos, totalCommits, topLanguages, score };
}
