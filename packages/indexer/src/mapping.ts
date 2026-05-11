import { BigInt } from "@graphprotocol/graph-ts";
import { ProofSubmitted } from "../generated/ProofVerifier/ProofVerifier";
import { Proof, User } from "../generated/schema";

export function handleProofSubmitted(event: ProofSubmitted): void {
  const userAddress = event.params.user.toHexString();

  let user = User.load(userAddress);
  if (!user) {
    user = new User(userAddress);
    user.address = event.params.user;
    user.totalProofs = BigInt.fromI32(0);
    user.firstSeenAt = event.block.timestamp;
  }

  user.totalProofs = user.totalProofs.plus(BigInt.fromI32(1));
  user.lastSeenAt = event.block.timestamp;
  user.save();

  const proofId =
    event.transaction.hash.toHexString() + "_" + event.logIndex.toString();

  const proof = new Proof(proofId);
  proof.user = userAddress;
  proof.achievementHash = event.params.achievementHash;
  proof.blockTimestamp = event.block.timestamp;
  proof.blockNumber = event.block.number;
  proof.transactionHash = event.transaction.hash;
  proof.save();
}
