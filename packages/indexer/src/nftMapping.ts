import { BigInt } from "@graphprotocol/graph-ts";
import { Issued, Revoked } from "../generated/SoulboundNft/SoulboundNft";
import { NFT, User } from "../generated/schema";

export function handleIssued(event: Issued): void {
  const userAddress = event.params.to.toHexString();

  // create user if not exists
  let user = User.load(userAddress);
  if (!user) {
    user = new User(userAddress);
    user.address = event.params.to;
    user.totalProofs = BigInt.fromI32(0);
    user.firstSeenAt = event.block.timestamp;
    user.lastSeenAt = event.block.timestamp;
    user.save();
  }

  const nftId = event.params.tokenId.toString();
  const nft = new NFT(nftId);
  nft.owner = userAddress;
  nft.tokenId = event.params.tokenId;
  nft.achievement = event.params.achievement;
  nft.tokenURI = event.params.tokenURI;
  nft.revoked = false;
  nft.blockTimestamp = event.block.timestamp;
  nft.txHash = event.transaction.hash;
  nft.save();
}

export function handleRevoked(event: Revoked): void {
  const nftId = event.params.tokenId.toString();
  const nft = NFT.load(nftId);
  if (!nft) return;
  nft.revoked = true;
  nft.save();
}
