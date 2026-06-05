# @my-app/frontend

Next.js 15 frontend for Skill Chain. Allows developers to connect their GitHub account and wallet, index their repositories, earn on-chain achievements, and mint soulbound NFT credentials.

## Tech Stack

- **Next.js 15** — App Router, Server Components
- **RainbowKit + Wagmi** — wallet connection and on-chain interactions
- **NextAuth** — GitHub OAuth authentication
- **TanStack Query** — data fetching and caching
- **Tailwind CSS v4** — styling
- **viem** — Ethereum utilities

---

## Structure

```
app/
├── page.tsx                  # Landing page
├── layout.tsx                # Root layout with providers
├── rainbowKitConfig.tsx      # Wagmi/RainbowKit config (Sepolia)
├── api/
│   └── auth/[...nextauth]/   # NextAuth GitHub OAuth handler
└── dashboard/
    ├── page.tsx              # Dashboard page
    ├── components/
    │   ├── RepoList.tsx          # Fetches and displays indexed repos
    │   ├── RepoSkeleton.tsx      # Loading skeleton for repo list
    │   ├── Achievement.tsx       # Displays earned/pending achievements
    │   ├── AutoClaimTrigger.tsx  # Auto-refreshes after claiming
    │   ├── MintButton.tsx        # Triggers NFT minting flow
    │   ├── MintedNft.tsx         # Displays minted NFTs
    │   ├── NftCard.tsx           # Individual NFT card
    │   ├── NftDetailModal.tsx    # NFT detail modal
    │   └── LogoutButton.tsx      # Signs out and disconnects wallet
    └── hooks/
        ├── useNftMetadata.ts     # Fetches NFT metadata from IPFS given a token URI
        ├── useUserNft.ts         # Fetches user's minted NFTs from The Graph subgraph
        └── useUserProofs.ts      # Fetches user's on-chain proof submissions

components/
├── LandingPage.tsx           # Full landing page layout
├── HeroSection.tsx           # Hero with connect wallet CTA
├── FeaturesSection.tsx       # Features overview
├── HowItWorkSection.tsx      # Step-by-step flow explanation
├── CTAsection.tsx            # Call to action
├── AchievementSection.tsx    # Achievement showcase
├── Navigation.tsx            # Top navigation bar
├── OnboardingModal.tsx       # Onboarding flow for new users
├── hooks/
│   └── useLogin.ts           # Handles GitHub + wallet login flow
└── ui/
    ├── Buttons.tsx           # Reusable button variants
    └── HeroBadge.tsx         # Badge component used in the hero section

lib/
├── auth.ts                   # NextAuth config and authOptions
├── github.ts                 # GitHub API helpers
├── provider.tsx              # WagmiProvider + RainbowKitProvider + SessionProvider
├── walletCookieSync.tsx      # Syncs wallet address to a cookie for SSR
└── utils.ts                  # Shared utility functions (cn, etc.)
```

---

## Pages

### `/` — Landing Page
Public landing page with hero, features, how it works, and achievement showcase sections. Includes a connect wallet + GitHub login CTA.

### `/dashboard` — Dashboard
Protected page. Shows:
- Indexed GitHub repositories and commit stats
- Earned and pending achievements
- Minted soulbound NFT credentials
- Mint button for pending achievements

---

## Auth Flow

1. User clicks **Connect** on the landing page
2. GitHub OAuth via NextAuth signs the user in
3. Wallet connection via RainbowKit
4. `useLogin` hook links the wallet address to the GitHub session
5. User is redirected to `/dashboard`

---

## Minting Flow

1. Backend indexes the user's GitHub repos and calculates a score
2. If the user meets achievement criteria, `Achievement.tsx` shows a claim button
3. User signs a message with their wallet (nonce-based)
4. Backend verifies the signature and returns a signed proof
5. `MintButton.tsx` submits the proof to `ProofVerifier` on-chain
6. Backend mints a `SoulboundNft` with metadata uploaded to IPFS

---

## Environment Variables

```env
# Auth
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=

# GitHub OAuth (from github.com/settings/developers)
GITHUB_ID=
GITHUB_SECRET=

# Backend
NEXT_PUBLIC_BACKEND_URL=https://your-backend.up.railway.app

# Wallet Connect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=

# The Graph
NEXT_PUBLIC_GRAPH_URL=https://api.studio.thegraph.com/query/<id>/skill-chain/version/latest

# Contract
NEXT_PUBLIC_CONTRACT_ADDRESS=
```

For local dev create `packages/frontend/.env.local` with the above vars pointing to localhost.

---

## Running Locally

```bash
pnpm dev
```

Starts the Next.js dev server on `http://localhost:3000`.

## Building

```bash
pnpm build
```

## Deployment

Deployed to Vercel. Vercel auto-detects Next.js and runs `turbo run build` from the monorepo root.

Make sure all env vars above are added in Vercel **Settings → Environment Variables** and listed in the root `turbo.json` under `env`.