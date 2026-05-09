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
    const { userAddress, achievementId } = req.body;

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
    const { data: achievement, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("id", achievementId)
      .single();

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

    if (existing) {
      return res.status(409).json({ error: "Achievement already claimed" });
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

    // record in db
    await supabase.from("user_achievements").insert({
      user_id: userId,
      wallet_address: userAddress,
      achievement_id: achievementId,
    });

    return res.json({
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

// get all achievements
app.get("/api/achievements", async (req, res) => {
  const { data, error } = await supabase
    .from("achievements")
    .select("id, name, description");

  if (error)
    return res.status(500).json({ error: "Failed to fetch achievements" });

  res.json(data);
});

app.get("/api/signer-address", (req, res) => {
  res.json({ address: signer.address });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
