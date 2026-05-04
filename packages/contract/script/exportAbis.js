const fs = require("fs");
const path = require("path");

const artifactDir = path.join(__dirname, "../out");
const outPutDir = path.join(__dirname, "../../shared/src/abis");

fs.mkdirSync(outPutDir, { recursive: true });

//export SkillChainContract ABI
const artifact = JSON.parse(
  fs.readFileSync(
    `${artifactDir}/SkillChainContract.sol/SkillChainContract.json`,
    "utf-8",
  ),
);

fs.writeFileSync(
  `${outPutDir}/SkillChainContract.ts`,
  `export const SkillChainContractABI = ${JSON.stringify(artifact.abi, null, 2)} as const;`,
);

console.log("ABIs exported to shared");
