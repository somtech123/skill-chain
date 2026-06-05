# @my-app/shared
 
Shared package for the Skill Chain monorepo. Contains types, ABIs, configuration, and utilities used across the frontend, backend, and indexer.
 ## Contents
 
### `src/types/`
TypeScript interfaces and types shared across all packages:
- `Repository`, `Commit`, `IndexedRepo` — GitHub repository and commit data
- `DeveloperStats` — aggregated developer metrics and scores
- `Achievement`, `UserAchievement`, `AchievementStatus` — on-chain achievement data
- `NFTMetadata`, `NftMetadata`, `UserNft` — NFT and IPFS metadata
- `MintResult`, `PendingMint` — minting flow types
- `SignProofResponse`, `ConfirmProofBody` — backend proof signing types
- `Status` — shared status union type

### `src/abis/`
Contract ABI definitions used by the frontend and backend for interacting with on-chain contracts.
 
### `src/config.ts`
Environment-aware configuration with dev and prod URLs:
```typescript
import { BACKEND_URL, FRONTEND_URL } from "@my-app/shared";
```
 ### `src/address.ts`
Contract addresses for each supported network (e.g. Sepolia).
 
### `src/graphql.ts`
GraphQL query definitions for The Graph subgraph.
 ## Usage
 
Import directly from the package:
```typescript
import { NFTMetadata, Achievement, BACKEND_URL } from "@my-app/shared";
```
 
## Building
 
```bash
pnpm build
```
 
Compiles TypeScript to `dist/`. The backend and indexer depend on the compiled output — always build shared before building those packages.
 
In Railway this is handled automatically by the build command:
```bash
pnpm install && pnpm --filter @my-app/shared build && pnpm --filter @my-app/backend build
```
 ## Notes
 
- This package is **not deployed** independently — it is consumed at build time by other packages in the monorepo
- Uses CommonJS output for compatibility with the Express backend
- The frontend consumes it directly via the pnpm workspace symlink