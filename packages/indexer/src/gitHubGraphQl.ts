import { IndexedRepo } from "@my-app/shared";

const GITHUB_API = "https://api.github.com/graphql";

async function gitHubGraphQl(
  accessToken: string,
  query: string,
  variables = {},
) {
  const res = await fetch(GITHUB_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const { data, errors } = await res.json();
  if (errors) throw new Error(errors[0].message);
  return data;
}

const QUERY = `
  query GetRepos($cursor: String) {
    viewer {
      repositories(first: 50, after: $cursor, orderBy: { field: UPDATED_AT, direction: DESC }) {
        pageInfo { hasNextPage endCursor }
        nodes {
          id
          name
          nameWithOwner
          url
          isPrivate
          description
          stargazerCount
          primaryLanguage { name }
          updatedAt
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 10) {
                  nodes {
                    oid
                    message
                    committedDate
                    author { name email }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function buildIndex(accessToken: string): Promise<IndexedRepo[]> {
  const repos: IndexedRepo[] = [];
  let cursor = null;

  while (true) {
    const data = await gitHubGraphQl(accessToken, QUERY, { cursor });
    const { nodes, pageInfo } = data.viewer.repositories;
    for (const repo of nodes) {
      repos.push({
        id: repo.id,
        name: repo.name,
        fullName: repo.nameWithOwner,
        description: repo.description,
        url: repo.url,
        isPrivate: repo.isPrivate,
        language: repo.primaryLanguage?.name ?? null,
        stars: repo.stargazerCount,
        updatedAt: repo.updatedAt,
        commits: repo.defaultBranchRef?.target?.history?.nodes ?? [],
        indexedAt: new Date().toISOString(),
      });
    }

    if (!pageInfo.hasNextPage) break;
    cursor = pageInfo.endCursor;
  }
  return repos;
}
