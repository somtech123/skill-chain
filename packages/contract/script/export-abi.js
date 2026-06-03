const fs = require("fs");
const path = require("path");

const artifactDir = path.join(__dirname, "../out");
const outPutDir = path.join(__dirname, "../../shared/src/abis");

fs.mkdirSync(outPutDir, { recursive: true });

//export ProofVerifier ABI
const artifact = JSON.parse(
  fs.readFileSync(
    `${artifactDir}/ProofVerifier.sol/ProofVerifier.json`,
    "utf-8",
  ),
);

fs.writeFileSync(
  `${outPutDir}/ProofVerifier.ts`,
  `export const ProofVerifier = ${JSON.stringify(artifact.abi, null, 2)} as const;`,
);

//export SoulBound ABI
const nftArtifact = JSON.parse(
  fs.readFileSync(`${artifactDir}/SoulboundNft.sol/SoulboundNft.json`, "utf-8"),
);

fs.writeFileSync(
  `${outPutDir}/SoulboundNft.ts`,
  `export const SoulboundNft = ${JSON.stringify(nftArtifact.abi, null, 2)} as const`,
);
