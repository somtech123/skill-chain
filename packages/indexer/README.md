# @my-app/indexer

The indexer package for Skill Chain. Handles two responsibilities:
1. **GitHub Indexing** — fetches and indexes a user's GitHub repositories and commits via the GitHub GraphQL API
2. **Subgraph** — The Graph protocol subgraph for indexing on-chain NFT and proof events from the Skill Chain smart contracts

## Contents

### `src/gitHubGraphqlQuery.ts`
Fetches all of a user's GitHub repositories and their recent commits using the GitHub GraphQL API. Paginates through all repos and returns them as `IndexedRepo[]` from `@my-app/shared`.

### `src/index.ts`
Entry point for the indexer.

### `src/mapping.ts`
The Graph subgraph event mappings for the `ProofVerifier` contract — handles on-chain proof verification events.

### `src/nftMapping.ts`
The Graph subgraph event mappings for the `SoulboundNft` contract — handles NFT mint and revoke events.

### `src/states.ts`
Shared state definitions used across the subgraph mappings.

## GitHub Indexing

The indexer fetches up to 50 repositories per page including:
- Repo metadata (name, description, language, stars, visibility)
- Last 10 commits per repo (hash, message, date, author)

```typescript
import { buildIndex } from "./gitHubGraphqlQuery";

const repos = await buildIndex(accessToken);
```

## Subgraph (The Graph)

The subgraph indexes events from two contracts deployed on-chain:
- `ProofVerifier` — tracks proof submissions and verifications
- `SoulboundNft` — tracks NFT mints and revocations

### Setup

Sync ABIs from the contract package:
```bash
pnpm sync-abi
```

Generate AssemblyScript types from the subgraph schema:
```bash
pnpm graph:codegen
```

Build the subgraph:
```bash
pnpm graph:build
```

### Deploying to The Graph Studio

Authenticate:
```bash
pnpm auth
```

Deploy:
```bash
pnpm graph:deploy
```

This deploys to The Graph Studio under the subgraph name `skill-chain`. After deploying you get a GraphQL endpoint:
```
https://api.studio.thegraph.com/query/<id>/skill-chain/version/latest
```

Add it to your env vars:
```env
# frontend (.env.local)
NEXT_PUBLIC_GRAPH_URL=https://api.studio.thegraph.com/query/<id>/skill-chain/version/latest

# backend (.env)
GRAPH_URL=https://api.studio.thegraph.com/query/<id>/skill-chain/version/latest
```

## Dependencies

- `@graphprotocol/graph-cli` — CLI for building and deploying subgraphs
- `@graphprotocol/graph-ts` — AssemblyScript types for subgraph mappings
- `@my-app/shared` — shared types used across the monorepo
- `viem` — Ethereum utilities

## Notes

- This package is **not deployed to Railway or Vercel** — the subgraph runs on The Graph's hosted infrastructure
- The GitHub indexing logic is called from the backend when a user connects their GitHub account
- ABI files are synced from the `contract` package using `pnpm sync-abi` before codegen