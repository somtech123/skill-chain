# @my-app/contract

Solidity smart contracts for Skill Chain, built with Foundry. Contains two contracts — a proof verifier and a soulbound NFT — deployed on Sepolia.

## Contracts

### `src/ProofVerifier.sol`

Verifies backend-signed proofs before a user can claim an achievement on-chain.

**How it works:**
1. The trusted backend signer signs a message containing the user's address, achievement hash, and a timestamp
2. The user submits this proof on-chain via `submitProof()`
3. The contract verifies the signature matches the trusted signer
4. Proofs expire after **10 minutes** and can only be used once (replay protection)

**Key functions:**

| Function | Description |
|----------|-------------|
| `submitProof(achievementHash, timestamp, signature)` | Submit and verify a backend-signed proof |
| `getProofs(user)` | Get all verified proofs for a user |
| `updateTrustedSigner(newSigner)` | Update the trusted signer address (owner only) |

**Errors:**
- `ProofVerifier__ProofExpired` — proof is older than 10 minutes
- `ProofVerifier__ProofAlreadyUsed` — proof has already been submitted
- `ProofVerifier__InValidSigner` — signature doesn't match the trusted signer

---

### `src/SoulboundNft.sol`

ERC-721 soulbound (non-transferable) NFT representing earned developer achievements. Token name: `SkillChainSoulboundCredential (SBC)`.

**Key properties:**
- Non-transferable — tokens cannot be moved between wallets
- One achievement per user — duplicate achievement mints are rejected
- Minter role — only authorized minter addresses can issue tokens
- Owner can revoke tokens

**Key functions:**

| Function | Description |
|----------|-------------|
| `issue(to, tokenURI, achievement)` | Mint a soulbound NFT to a user (minter only) |
| `revoke(tokenId)` | Burn a token and clear its achievement record (owner only) |
| `setMinter(address, authorized)` | Grant or revoke minter role (owner only) |
| `hasAchievement(user, achievement)` | Check if a user holds a specific achievement |
| `totalIssued()` | Total number of tokens ever minted |

**Errors:**
- `SoulboundNft__NotTransferable` — token transfer attempted
- `SoulboundNft__NotMinter` — caller is not an authorized minter
- `SoulboundNft__AchievementAlreadyIssued` — user already holds this achievement

---

## Scripts

### `script/Deploy.s.sol`
Foundry deployment script. Deploys both `ProofVerifier` and `SoulboundNft`, sets the backend minter wallet as an authorized minter, and sets the trusted signer on `ProofVerifier`.

### `script/export-abi.js`
Copies compiled ABIs from `out/` to `packages/shared/abis/` so the frontend and backend can use them.

### `script/write-address.js`
Writes deployed contract addresses to `packages/shared/src/address.ts` for the given chain ID.

### `script/HelperConfig.s.sol`
Network configuration helper used by the deploy script.

---

## Setup

Install Foundry if you haven't:
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

Install dependencies:
```bash
forge install
```

---

## Building

```bash
pnpm build
```

Runs `forge build` and exports ABIs and addresses to `@my-app/shared`.

---

## Testing

```bash
pnpm test
```

Runs all Foundry tests with verbose output (`-vvv`).

---

## Deployment

### Local (Anvil)
```bash
pnpm deploy:local
```

### Sepolia
```bash
pnpm deploy:sepolia
```

Requires a `.env` file in `packages/contract/`:
```env
PRIVATE_KEY=           # deployer wallet private key
ETHERSCAN_API_KEY=     # for contract verification
```

Also requires `[rpc_endpoints]` configured in `foundry.toml`:
```toml
[rpc_endpoints]
sepolia = "https://sepolia.infura.io/v3/YOUR_KEY"
```

### Other Networks
```bash
pnpm deploy:base       # Base mainnet
pnpm deploy:arbitrum   # Arbitrum mainnet
```

---

## After Deployment

After deploying to a new network:

1. ABIs are automatically exported to `packages/shared/src/abis/`
2. Contract addresses are automatically written to `packages/shared/src/address.ts`
3. Set the deployed `SoulboundNft` address as the contract address in the backend env
4. Set the backend minter wallet as an authorized minter:
   ```solidity
   SoulboundNft.setMinter(MINTER_WALLET_ADDRESS, true)
   ```
5. Set the backend signer wallet as the trusted signer on `ProofVerifier`:
   ```solidity
   ProofVerifier.updateTrustedSigner(SIGNER_WALLET_ADDRESS)
   ```

---

## Dependencies

- [OpenZeppelin Contracts](https://github.com/OpenZeppelin/openzeppelin-contracts) — `Ownable`, `ECDSA`, `ERC721URIStorage`
- [Foundry](https://book.getfoundry.sh/) — build, test, and deploy toolchain