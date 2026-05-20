import express from "express";
import { Contract, ethers } from "ethers";
import cors from "cors";
import supabase from "./superbase";
import { uploadNFTToIPFS } from "./pinata";
import dotenv from "dotenv";
import {
  CONTRACT_ADDRESSES,
  SoulboundNft,
  UserAchievement,
} from "@my-app/shared";
import { RPC_URLS } from "./config";
import { requireAuth } from "./middleware/requireAuth";
import crypto from "crypto";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const signer = new ethers.Wallet(process.env.SIGNER_PRIVATE_KEY!);
const NONCE_TTL_MS = 5 * 60 * 1000; // 5 minutes

//----------Helper---------------------------------
function extractField(message: string, field: string): string | null {
  // Matches "Field:\n<value>" up to the next newline
  const lines = message.split("\n");
  const idx = lines.findIndex((l) => l.trim() === `${field}:`);
  return idx !== -1 && lines[idx + 1] ? lines[idx + 1].trim() : null;
}

//-------GET /api/nonce----------------------------------
app.get("/api/nonce", requireAuth, async (req, res) => {
  const userId = req.user!.id;

  const nonce = crypto.randomBytes(16).toString("hex");
  const expiresAt = new Date(Date.now() + NONCE_TTL_MS).toISOString();
  const { error } = await supabase
    .from("nonces")
    .insert({ user_id: userId, nonce, expires_at: expiresAt });

  if (error) {
    console.error("Failed to store nonce:", error);
    return res.status(500).json({ error: "Failed to generate nonce" });
  }

  return res.json({ nonce });
});

//--------POST /api/sign-proof---------------------

app.post("/api/sign-proof", requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;

    const { userAddress, achievementId, message, walletSignature } = req.body;
    console.log("Request body:", { userAddress, achievementId, userId });

    // validate inputs
    if (!userAddress || !achievementId || !message || !walletSignature) {
      return res.status(400).json({ error: "Missing required fields" });
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

    //Parse fields out of the signed message
    const messageUserId = extractField(
      message,
      "Claiming achievement for user",
    );
    const messageAddress = extractField(message, "Address");
    const nonce = extractField(message, "Nonce");
    if (!messageUserId || !messageAddress || !nonce) {
      return res.status(400).json({ error: "Malformed message" });
    }

    //Message fields must match session + request
    if (messageUserId !== userId) {
      return res.status(403).json({ error: "User ID mismatch" });
    }
    if (messageAddress.toLowerCase() !== userAddress.toLowerCase()) {
      return res.status(403).json({ error: "Address mismatch in message" });
    }

    //Verify wallet signature recovers to the claimed address
    let recoveredAddress: string;
    try {
      recoveredAddress = ethers.verifyMessage(message, walletSignature);
    } catch {
      return res.status(400).json({ error: "Invalid wallet signature" });
    }

    if (recoveredAddress.toLowerCase() !== userAddress.toLowerCase()) {
      return res.status(403).json({ error: "Wallet signature mismatch" });
    }

    //Consume nonce atomically

    const { data: consumedNonce, error: nonceError } = await supabase
      .from("nonces")
      .delete()
      .eq("user_id", userId)
      .eq("nonce", nonce)
      .gt("expires_at", new Date().toISOString())
      .select("id")
      .single();

    if (nonceError || !consumedNonce) {
      return res.status(403).json({ error: "Invalid or expired nonce" });
    }

    //Fetch achievement
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

//-------------POST /api/confirm-proof -------------------
app.post("/api/confirm-proof", requireAuth, async (req, res) => {
  try {
    const userId = req.user!.id;

    const { userAddress, achievementId, txHash } = req.body;

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
      minted: false,
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
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/signer-address", (req, res) => {
  res.json({ address: signer.address });
});

app.get("/api/user-achievements/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { totalRepos, totalCommits, score } = req.query;

    const stats = {
      total_repos: Number(totalRepos ?? 0),
      total_commits: Number(totalCommits ?? 0),
      score: Number(score ?? 0),
    };

    function meetsCriteria(criteria: any): boolean {
      if (!criteria) return false;
      if (criteria.minRepos && stats.total_repos < criteria.minRepos)
        return false;
      if (criteria.minCommits && stats.total_commits < criteria.minCommits)
        return false;
      if (criteria.minScore && stats.score < criteria.minScore) return false;
      return true;
    }

    //fetch all user achievement
    const { data: userAchievements, error: uaError } = await supabase
      .from("user_achievements")
      .select(
        `
            id,
            achievement_id,
            minted,
            claimed_at,
            tx_hash,
            wallet_address,
            achievements (
          id,
          name,
          description,
          created_at
            )
          `,
      )
      .eq("user_id", userId)
      .order("claimed_at", { ascending: true })
      .returns<UserAchievement[]>();
    if (uaError) {
      console.error("uaError:", uaError);
      return res
        .status(500)
        .json({ error: "Failed to fetch user achievements" });
    }

    // fetch all achievements with criteria
    const { data: allAchievements, error: achError } = await supabase
      .from("achievements")
      .select("id, name, description, created_at,criteria")
      .order("created_at", { ascending: true });

    if (achError) {
      console.error("achError:", achError);
      return res.status(500).json({ error: "Failed to fetch achievements" });
    }

    const earnedId = new Set(userAchievements.map((a) => a.achievement_id));
    const minted = userAchievements.filter((a) => a.minted);
    const unminted = userAchievements.filter((a) => !a.minted);

    const achievementStatus = allAchievements.map((achievement) => {
      const userRecord = userAchievements.find(
        (ua) => ua.achievement_id === achievement.id,
      );
      return {
        ...achievement,
        earned: !!userRecord,
        minted: userRecord?.minted ?? false,
        claimed_at: userRecord?.claimed_at ?? null,
        tx_hash: userRecord?.tx_hash ?? null,
      };
    });

    const pendingMints = unminted.map((a) => ({
      userAchievementId: a.id,
      achievementId: a.achievement_id,
      name: a.achievements?.name,
      claimed_at: a.claimed_at,
    }));

    // const nextAchievement =
    //   allAchievements.find((a) => !earnedId.has(a.id)) ?? null;

    // next unearned achievement with reached flag
    const nextAchievement =
      allAchievements
        .filter((a) => !earnedId.has(a.id))
        .map((a) => ({
          ...a,
          reached: meetsCriteria(a.criteria),
        }))
        .at(0) ?? null;

    const payload = {
      success: true,
      achievementStatus,
      pendingMints,
      minted,
      nextAchievement,
    };

    console.log("user achievements payload:", payload);
    return res.json(payload);
  } catch (e) {
    console.error("Unexpected error in /user-achievements:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/claim-achievement", async (req, res) => {
  try {
    const { userId, achievementId } = req.body;

    // check it's not already claimed
    const { data: existing } = await supabase
      .from("user_achievements")
      .select("id")
      .eq("user_id", userId)
      .eq("achievement_id", achievementId)
      .single();

    if (existing) {
      return res.json({ success: true, alreadyClaimed: true });
    }

    const { error } = await supabase.from("user_achievements").insert({
      user_id: userId,
      achievement_id: achievementId,
      minted: false,
      claimed_at: new Date().toISOString(),
      wallet_address: null,
      tx_hash: null,
    });
    if (error) throw error;

    return res.json({ success: true });
  } catch (e) {
    console.error("claim-achievement error:", e);
    return res.status(500).json({ error: "Failed to claim achievement" });
  }
});

app.post("/api/mark-minted", async (req, res) => {
  try {
    const { userId, achievementId, walletAddress, txHash } = req.body;

    if (!userId || !achievementId || !walletAddress || !txHash)
      return res.status(400).json({ error: "Missing fields" });

    const { error: updateError } = await supabase
      .from("user_achievements")
      .update({ minted: true, wallet_address: walletAddress, tx_hash: txHash })
      .eq("user_id", userId)
      .eq("achievement_id", achievementId);

    if (updateError)
      return res
        .status(500)
        .json({ error: "Failed to mark achievement as minted" });

    return res.json({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/mint", async (req, res) => {
  try {
    const { stats, achievementId, userId, address } = req.body;
    const chainId = Number(req.body.chainId); // force cast

    if (!stats || !achievementId || !userId || !address || !chainId) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const metadataUri = await uploadNFTToIPFS(achievementId, stats);
    const achievementHash = ethers.solidityPackedKeccak256(
      ["string", "string"],
      [String(achievementId), String(userId)],
    );

    const rpcUrl = RPC_URLS[chainId];
    if (!rpcUrl) throw new Error(`No RPC URL for chain ${chainId}`);

    const contractAddress = CONTRACT_ADDRESSES[chainId!].soulboundNft;
    console.log(contractAddress);
    if (!contractAddress) {
      throw new Error(`No contract address for chain ${chainId}`);
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const minterWallet = new ethers.Wallet(
      process.env.MINTER_PRIVATE_KEY!,
      provider,
    );
    const contract = new ethers.Contract(
      contractAddress,
      SoulboundNft,
      minterWallet,
    );

    const tx = await contract.issue(address, metadataUri, achievementHash);
    const hash = await tx.wait();
    console.log("hash is", { hash });
    console.log("status:", hash.status);
    if (hash.status === 0) {
      throw new Error("Transaction mined but reverted");
    }

    return res.json({
      success: true,
      userId: userId,
      metadataUri: metadataUri,
      txHash: hash.hash,
    });
  } catch (e) {
    console.error("Mint error:", e);
    return res.status(500).json({ error: "Mint failed" });
  }
});
app._router.stack.forEach((r: any) => {
  if (r.route?.path) {
    console.log(r.route.path);
    console.log(RPC_URLS[11155111]);
  }
});
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
