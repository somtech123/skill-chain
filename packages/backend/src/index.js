const express = require("express");
const { ethers } = require("ethers");
const cors = require("cors");
const supabase = require("./superbase");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const signer = new ethers.Wallet(process.env.SIGNER_PRIVATE_KEY);
console.log("Trusted Signer Address:", signer.address);

app.post("/api/sign-proof", async (req, res) => {
  try {
    const { userAddress, achievementId, userId } = req.body;
    console.log("Request body:", { userAddress, achievementId, userId });

    // validate inputs
    if (!userAddress || !achievementId) {
      return res
        .status(400)
        .json({ error: "Missing userAddress or achievementId" });
    }
    if (!ethers.isAddress(userAddress)) {
      return res.status(400).json({ error: "Invalid address" });
    }

    // fetch achievement from supabase if exist
    console.log(
      "Querying for achievementId:",
      JSON.stringify(achievementId),
      "length:",
      achievementId.length,
    );

    const { data: achievement, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("id", achievementId)
      .single();
    console.log("Supabase result:", { achievement, error });

    if (error || !achievement) {
      return res.status(404).json({ error: "Achievement not found" });
    }

    // check already claimed
    const { data: existing } = await supabase
      .from("user_achievements")
      .select("id")
      .eq("user_id", userId)
      .eq("achievement_id", achievementId)
      .single();

    console.log("existing check:", {
      existing,
      userId,
      achievementId,
    });

    if (existing) {
      return res.status(200).json({
        alreadyClaimed: true,
        achievementName: achievement.name,
      });
    }

    // build achievement hash
    const achievementHash = ethers.solidityPackedKeccak256(
      ["string"],
      [achievementId],
    );

    // build timestamp
    const timestamp = Math.floor(Date.now() / 1000);

    // build message hash
    const messageHash = ethers.solidityPackedKeccak256(
      ["address", "bytes32", "uint256"],
      [userAddress, achievementHash, timestamp],
    );

    //sign hash
    const signature = await signer.signMessage(ethers.getBytes(messageHash));

    return res.json({
      alreadyClaimed: false,
      achievementHash,
      timestamp,
      signature,
      achievementName: achievement.name,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/confirm-proof", async (req, res) => {
  console.log("===============================add db");
  try {
    const { userAddress, achievementId, userId, txHash } = req.body;

    if (!userAddress || !achievementId || !userId || !txHash) {
      return res.status(400).json({ error: "Missing fields" });
    }
    const { data: existing } = await supabase
      .from("user_achievements")
      .select("id")
      .eq("user_id", userId)
      .eq("achievement_id", achievementId)
      .single();

    if (existing) {
      return res.status(200).json({ success: true, alreadyRecorded: true });
    }

    await supabase.from("user_achievements").insert({
      user_id: userId,
      wallet_address: userAddress,
      achievement_id: achievementId,
      tx_hash: txHash,
    });

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// get all achievements
app.get("/api/achievements", async (req, res) => {
  const { data, error } = await supabase
    .from("achievements")
    .select("id, name, description");

  if (error)
    return res.status(500).json({ error: "Failed to fetch achievements" });

  res.json(data);
});

//get achievement name by hash

app.get("/api/achievement-by-hash/:hash", async (req, res) => {
  try {
    const { hash } = req.params;

    // fetch all achievements from db
    const { data: achievements, error } = await supabase
      .from("achievements")
      .select("id, name, description");

    if (error)
      return res.status(500).json({ error: "Failed to fetch achievements" });

    const match = achievements?.find((e) => {
      const computed = ethers.solidityPackedKeccak256(["string"], [e.id]);
      return computed.toLowerCase() === hash.toLowerCase();
    });

    if (!match) return res.status(400).json({ error: "Achievement not found" });
    res.json({
      id: match.id,
      name: match.name,
      description: match.description,
    });
  } catch (e) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/signer-address", (req, res) => {
  res.json({ address: signer.address });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
