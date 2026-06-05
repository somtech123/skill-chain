# @my-app/backend

Express backend for Skill Chain. Handles achievement proof signing, NFT minting, IPFS metadata uploads, and Supabase database operations.

## Contents

### `src/index.ts`
Main Express server with all API endpoints.

### `src/config.ts`
RPC URL configuration per chain ID (e.g. Sepolia).

### `src/pinata.ts`
Uploads NFT metadata to IPFS via Pinata before minting.

### `src/superbase.ts`
Supabase client initialization.

### `src/middleware/`
- `requireAuth` — validates the NextAuth session token on protected routes
- `helper.ts` — utility to extract fields from signed messages

### `src/generateSigner.ts`
One-time utility script to generate a new private key for the proof signer wallet.

### `src/images/`
Static NFT images used when generating metadata for IPFS upload.

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/debug` | ❌ | Debug session and env info |
| `GET` | `/api/nonce` | ✅ | Generate a one-time nonce for wallet signing |
| `POST` | `/api/sign-proof` | ✅ | Verify wallet signature and return a signed proof for on-chain claiming |
| `POST` | `/api/confirm-proof` | ✅ | Record a confirmed on-chain proof transaction in Supabase |
| `GET` | `/api/achievements` | ❌ | List all available achievements |
| `GET` | `/api/achievement-by-hash/:hash` | ❌ | Look up an achievement by its keccak256 hash |
| `GET` | `/api/signer-address` | ❌ | Return the signer wallet's public address |
| `GET` | `/api/user-achievements/:userId` | ✅ | Get a user's earned, pending, and minted achievements |
| `POST` | `/api/claim-achievement` | ✅ | Record a claimed achievement for a user |
| `POST` | `/api/mark-minted` | ✅ | Mark an achievement as minted with tx hash and wallet address |
| `POST` | `/api/mint` | ✅ | Upload metadata to IPFS and mint a Soulbound NFT on-chain |

## Proof Signing Flow

1. Frontend calls `GET /api/nonce` to get a one-time nonce
2. User signs a message containing their user ID, wallet address, and nonce
3. Frontend calls `POST /api/sign-proof` with the signed message
4. Backend verifies the wallet signature, consumes the nonce, and returns a backend-signed proof
5. Frontend submits the proof to the `ProofVerifier` smart contract
6. Frontend calls `POST /api/confirm-proof` with the transaction hash

## NFT Minting Flow

1. Frontend calls `POST /api/mint` with the user's stats and achievement ID
2. Backend uploads NFT metadata (name, description, image, attributes) to IPFS via Pinata
3. Backend calls `SoulboundNft.issue()` on-chain using the minter wallet
4. Returns the transaction hash and metadata URI

## Environment Variables

```env
PORT=3002
NEXTAUTH_SECRET=          # must match the frontend NextAuth secret
SIGNER_PRIVATE_KEY=       # private key for signing achievement proofs
MINTER_PRIVATE_KEY=       # private key for sending mint transactions
SUPABASE_URL=             # Supabase project URL
SUPABASE_SERVICE_ROLE_KEY= # Supabase service role key (not anon key)
SEPOLIA_RPC_URL=          # RPC URL for Sepolia (e.g. Infura, Alchemy)
PINATA_API_KEY=           # Pinata API key for IPFS uploads
PINATA_SECRET_KEY=        # Pinata secret key
FRONTEND_URL=             # used for CORS (e.g. https://your-app.vercel.app)
```

## Generating a Signer Key

To generate a new private key for the proof signer:

```bash
pnpm generate-signer
```

Copy the output private key into `SIGNER_PRIVATE_KEY` in your env. The corresponding public address should be set as the authorized signer in the `ProofVerifier` smart contract.

## Running Locally

```bash
pnpm dev
```

Starts the server with `ts-node` on port `3002` (or `PORT` env var).

## Building

```bash
pnpm build
```

Compiles TypeScript to `dist/`.

## Production

```bash
pnpm start
```

Runs the compiled `dist/index.js`. This is the command used by Railway.

## Deployment

Deployed to Railway. See the root README for full deployment instructions.

The Railway build command is:
```bash
pnpm install && pnpm --filter @my-app/shared build && pnpm --filter @my-app/backend build
```

Start command:
```bash
node packages/backend/dist/index.js
```