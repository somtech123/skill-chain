const fs = require("fs");
const path = require("path");

const CHAIN_NAMES = {
  31337: "anvil",
  11155111: "sepolia",
  8453: "base",
  42161: "arbitrum",
  1: "mainnet",
};

function getDeployedAddresses(chainId) {
  const broadCastPath = path.join(
    __dirname,
    `../broadcast/Deploy.s.sol/${chainId}/run-latest.json`,
  );

  if (!fs.existsSync(broadCastPath)) {
    throw new Error(`No broadcast found for chain ${chainId}`);
  }

  const broadcast = JSON.parse(fs.readFileSync(broadCastPath, "utf-8"));

  const createTxs = broadcast.transactions.filter(
    (tx) => tx.transactionType === "CREATE",
  );

  if (createTxs.length < 2) {
    throw new Error(
      `Expected at least 2 CREATE transactions, found ${createTxs.length}`,
    );
  }

  // Foundry broadcast includes contractName for each CREATE tx
  const proofVerifierTx = createTxs.find(
    (tx) => tx.contractName === "ProofVerifier",
  );
  const soulboundNftTx = createTxs.find(
    (tx) => tx.contractName === "SoulboundNft",
  );

  if (!proofVerifierTx) throw new Error("ProofVerifier CREATE tx not found");
  if (!soulboundNftTx) throw new Error("SoulboundNft CREATE tx not found");

  return {
    proofVerifier: proofVerifierTx.contractAddress,
    soulboundNft: soulboundNftTx.contractAddress,
  };
}

const chainId = parseInt(process.argv[2]);
if (!chainId) {
  console.error("Usage: node write-address.js <chainId>");
  process.exit(1);
}

const { proofVerifier, soulboundNft } = getDeployedAddresses(chainId);

console.log(`Deployed on chain ${chainId}:`);
console.log(`  ProofVerifier: ${proofVerifier}`);
console.log(`  SoulboundNft:  ${soulboundNft}`);
const configPath = path.join(__dirname, "../../shared/src/address.ts");
let configContent = fs.readFileSync(configPath, "utf-8");

// Keep a backup in case something goes wrong
const backup = configContent;

const newEntry = `  ${chainId}: {
    proofVerifier: "${proofVerifier}",
    soulboundNft: "${soulboundNft}",
  },`;

const existingPattern = new RegExp(
  `[ \\t]*${chainId}:\\s*\\{\\s*proofVerifier:[^,]+,\\s*soulboundNft:[^}]+\\},?\\n?`,
  "g",
);

if (existingPattern.test(configContent)) {
  // Replace existing entry
  configContent = configContent.replace(existingPattern, `${newEntry}\n`);
} else {
  // Insert before closing }; of CONTRACT_ADDRESSES
  configContent = configContent.replace(
    /(export const CONTRACT_ADDRESSES[^{]*{)([\s\S]*?)(};)/,
    `$1$2${newEntry}\n$3`,
  );
}

// Sanity check — bail out if the interface got eaten
if (!configContent.includes("interface ChainContracts")) {
  fs.writeFileSync(configPath, backup);
  console.error("Write aborted — regex corrupted the file, backup restored.");
  process.exit(1);
}

fs.writeFileSync(configPath, configContent);
console.log(`Updated ${configPath}`);
