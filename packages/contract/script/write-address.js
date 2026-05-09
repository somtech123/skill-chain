const fs = require("fs");
const path = require("path");

const CHAIN_NAMES = {
  31337: "anvil",
  11155111: "sepolia",
  8453: "base",
  42161: "arbitrum",
  1: "mainnet",
};

function getDeployedAddress(chainId) {
  const broadCastPath = path.join(
    __dirname,
    `../broadcast/DeployProofVerifier.s.sol/${chainId}/run-latest.json`,
  );

  if (!fs.existsSync(broadCastPath)) {
    throw new Error(`No broadcast found for chain ${chainId}`);
  }

  const broadcast = JSON.parse(fs.readFileSync(broadCastPath, "utf-8"));

  const deployTx = broadcast.transactions.find(
    (tx) => tx.transactionType === "CREATE",
  );

  if (!deployTx) throw new Error("No CREATE transaction found");

  return deployTx.contractAddress;
}

const chainId = parseInt(process.argv[2]);
if (!chainId) {
  console.error("Usage: node write-address.js <chainId>");
  process.exit(1);
}

const address = getDeployedAddress(chainId);
console.log(`Deployed on chain ${chainId}: ${address}`);

const configPath = path.join(__dirname, "../../shared/src/address.ts");
let configContent = fs.readFileSync(configPath, "utf-8");

const newEntry = `  ${chainId}: {
    contract: "${address}",
    no_check: "${address}",
  },`;

// check if chain entry already exists
const existingPattern = new RegExp(`(\\s*${chainId}:\\s*\\{[^}]*\\},?)`, "s");

if (existingPattern.test(configContent)) {
  // replace existing entry
  configContent = configContent.replace(existingPattern, `\n${newEntry}`);
} else {
  // insert before closing }; of CONTRACT_ADDRESSES
  configContent = configContent.replace(
    /(export const CONTRACT_ADDRESSES[^{]*{)([\s\S]*?)(};)/,
    `$1$2${newEntry}\n$3`,
  );
}

fs.writeFileSync(configPath, configContent);
