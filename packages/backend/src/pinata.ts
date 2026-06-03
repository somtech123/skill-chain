import { PinataSDK } from "pinata-web3";
import { NFTMetadata } from "@my-app/shared";

import fs from "fs";
import path from "path";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.PINATA_GATEWAY!,
});
// Cache groupId per achievementId so we don't create duplicates per run
const groupCache: Record<string, string> = {};

async function getOrCreateGroup(achievementId: string): Promise<string> {
  if (groupCache[achievementId]) return groupCache[achievementId];
  // Check if group already exists in Pinata
  const groups = await pinata.groups.list().name(achievementId);
  if (groups.length > 0) {
    groupCache[achievementId] = groups[0].id;
    return groups[0].id;
  }

  // Create a new group
  const group = await pinata.groups.create({ name: achievementId });
  groupCache[achievementId] = group.id;
  return group.id;
}

async function uploadImage(
  imagePath: string,
  filename: string,
  groupId: string,
): Promise<string> {
  const imgBuffer = fs.readFileSync(imagePath);
  const file = new File([imgBuffer], filename, { type: "image/png" });

  const res = await pinata.upload
    .file(file)
    .addMetadata({ name: filename })
    .group(groupId);
  return `ipfs://${res.IpfsHash}`;
}

function buildMetadata(
  achievementId: string,
  imageCid: string,
  stats: { score: number; totalRepos: number; totalCommits: number },
): NFTMetadata {
  switch (achievementId) {
    case "first_login":
      return {
        name: "First Login",
        description:
          "Awarded for logging in for the first time and connecting github account.",
        image: imageCid,
        attributes: [
          {
            trait_type: "Achievement",
            value: "First Login and GitHub Connected",
          },
          { trait_type: "Type", value: "Milestone" },
          { trait_type: "Repos", value: stats.totalRepos },
          { trait_type: "Commits", value: stats.totalCommits },
          { trait_type: "Score", value: stats.score },
        ],
      };
    default:
      return {
        name: achievementId,
        description: `Awarded for completing: ${achievementId}`,
        image: imageCid,
        attributes: [
          { trait_type: "Achievement", value: achievementId },
          { trait_type: "Score", value: stats.score },
          { trait_type: "Repos", value: stats.totalRepos },
          { trait_type: "Commits", value: stats.totalCommits },
        ],
      };
  }
}

async function uploadMetadata(
  metadata: NFTMetadata,
  achievementId: string,
  groupId: string,
): Promise<string> {
  const res = await pinata.upload
    .json(metadata)
    .addMetadata({
      name: `${achievementId}-metadata`,
    })
    .group(groupId);
  return `ipfs://${res.IpfsHash}`;
}

const acImage: Record<string, string> = {
  first_login: path.join(__dirname, "images/first-login.png"),
  has_10_repo: path.join(__dirname, "images/has-10-repo.png"),
};

export async function uploadNFTToIPFS(
  achievementId: string,
  stats: { score: number; totalRepos: number; totalCommits: number },
): Promise<string> {
  const groupId = await getOrCreateGroup(achievementId);

  const imgPath =
    acImage[achievementId] ?? path.join(__dirname, "images/default.png");
  const filename = path.basename(imgPath);

  const imageCid = await uploadImage(imgPath, filename, groupId);

  const metadata = buildMetadata(achievementId, imageCid, stats);
  const metadataUri = await uploadMetadata(metadata, achievementId, groupId);

  return metadataUri;
}
